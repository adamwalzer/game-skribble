import config from './config';

import Loader from 'shared/components/loader/0.1';

import iOSScreen from 'shared/components/ios_splash_screen/0.1';
import TitleScreen from './components/title_screen';
import MenuScreen from './components/menu_screen';
import FriendScreen from './components/friend_screen';
import CanvasScreen from './components/canvas_screen';
import ItemDrawerScreen from './components/item_drawer_screen';
import InboxScreen from './components/inbox_screen';
import PreviewScreen from './components/preview_screen';
import SendScreen from './components/send_screen';
import SentScreen from './components/sent_screen';
import ReadScreen from './components/read_screen';

import QuitScreen from 'shared/components/quit_screen/0.1';
import SaveMenu from './components/save_menu';
import CollisionWarning from './components/collision_warning';
import LimitWarning from './components/limit_warning';

const DEFAULT_PROFILE_IMAGE = '';

class SkribbleGame extends skoash.Game {
    getRules(opts = {}) {
        if (typeof opts.respond === 'function') {
            return opts.respond(this.refs['screen-canvas'].getData());
        }
        return this.refs['screen-canvas'].getData();
    }

    save(opts = {}, skramble = false) {
        /* eslint-disable camelcase */
        var friend_to;
        var rules;
        var skribble;
        var self = this;

        friend_to = self.state.recipient && self.state.recipient.user_id ?
            self.state.recipient.user_id : null;
        rules = self.getRules();
        skribble = {
            'version': config.version,
            ...self.state.skribbleData,
            friend_to,
            skramble,
            rules
        };

        if (!rules.background && !rules.items.length && !rules.messages.length) {
            return;
        }

        if (JSON.stringify(skribble) !== JSON.stringify(this.state.skribble)) {
            self.emit({
                name: 'saveSkribble',
                game: self.props.config.id,
                skribble,
            }).then(skribbleData => {
                self.setState({
                    skribbleData,
                    skribble
                });
            });
        }
        /* eslint-enable camelcase */
    }

    send() {
        this.save({}, true);

        this.refs['screen-canvas'].reset();
        this.navigator.goto({
            index: 'sent',
            recipient: this.state.recipient,
        });

        this.setState({
            recipient: null,
            skribbleData: null,
        });
    }

    loadSkribble(opts) {
        this.setState({
            skribbleData: opts.message
        }, () => {
            this.refs['screen-canvas'].addItems(opts.message);
            this.navigator.goto({
                index: 'canvas',
                draft: true,
            });
        });
    }

    getMedia(path) {
        var pathArray;
        var self = this;

        if (typeof path === 'object') path = path.path;
        path = path || 'skribble/menu';
        pathArray = path.split('/');
        pathArray.shift();

        return self.eventManager.emit({
            name: 'getMedia',
            path
        }).then(d => {
            var opts;
            var currentOpts;
            opts = {
                data: {},
                callback: () => {
                    self.refs['screen-canvas'].setMenu();
                    self.refs['screen-item-drawer'].updateData();
                }
            };
            currentOpts = opts.data;

            pathArray.forEach((key, index) => {
                currentOpts[key] = {
                    items: {}
                };
                if (index !== pathArray.length - 1) {
                    currentOpts = currentOpts[key].items;
                }
            });

            currentOpts[pathArray[pathArray.length - 1]] = _.clone(d);
            currentOpts[pathArray[pathArray.length - 1]].items = {};

            if (d.items) {
                d.items.forEach(item => {
                    if (item.asset_type === 'folder' && item.name) {
                        self.getMedia(path + '/' + item.name);
                    }
                    currentOpts[pathArray[pathArray.length - 1]].items[item.name] = item;
                });
            }
            self.updateData(opts);
        });
    }

    showCollisionWarning() {
        if (!this.state.data.collisionWarning.show) return;
        this.navigator.openMenu({id: 'collisionWarning'});
    }

    showLimitWarning() {
        this.navigator.openMenu({id: 'limitWarning'});
    }

    addRecipient(recipient, cb) {
        var src;

        if (recipient.src) {
            recipient.profile_image = recipient.src; // eslint-disable-line camelcase
        } else if (typeof recipient === 'string') {
            if (this.state.data && this.state.data.user) {
                this.state.data.user.some(friend => {
                    if (friend.friend_id === recipient) {
                        recipient = friend;
                        return true;
                    }
                    return false;
                });
            }
        }

        if (typeof recipient === 'string') {
            this.getData({
                name: 'getFriend',
                'friend_id': recipient,
                callback: () => {
                    this.addRecipient(recipient, cb);
                }
            });
        } else {
            src = recipient && recipient._embedded && recipient._embedded.image &&
                recipient._embedded.image.url ?
                recipient._embedded.image.url :
                recipient.profile_image || DEFAULT_PROFILE_IMAGE;
            this.setState({
                recipient: {
                    'user_id': recipient.user_id || recipient.friend_id,
                    name: recipient.name || recipient.username,
                    src,
          // I need to get the flips earned back from the backend to do this.
                    description: '',
          // description: friend.flips_earned + ' Flips Earned',
                    'asset_type': 'friend',
                }
            }, cb);
        }
    }

    clickRecipient() {
        this.navigator.goto({
            index: 'friend',
            goto: this.state.currentScreenIndex,
        });
    }

    create() {
        if (this.state.recipient) {
            this.navigator.goto({index: 'canvas'});
        } else {
            this.navigator.goto({
                index: 'friend',
                goto: 'canvas',
            });
        }
    }

    saveButton() {
        this.save();
        this.navigator.openMenu({id: 'save'});
    }

    renderRecipient() {
        var recipient = this.state.recipient;
        var content = [];

        if (!recipient) return;

        if (recipient.name) {
            content.push(<span className="name">{recipient.name}</span>);
        }

        if (recipient.src) {
            content.push(<img className="profile-image" src={recipient.src} />);
        }

        return content;
    }
}

skoash.start(
    <SkribbleGame
        config={config}
        screens={{
            0: iOSScreen,
            1: TitleScreen,
            menu: MenuScreen,
            friend: FriendScreen,
            canvas: CanvasScreen,
            'item-drawer': ItemDrawerScreen,
            inbox: InboxScreen,
            preview: PreviewScreen,
            send: SendScreen,
            sent: SentScreen,
            read: ReadScreen,
        }}
        menus={{
            quit: QuitScreen,
            save: SaveMenu,
            collisionWarning: CollisionWarning,
            limitWarning: LimitWarning,
        }}
        loader={<Loader />}
        assets={[
            <skoash.Audio ref="bkg1" type="background" src={`${CMWN.MEDIA.EFFECT}BKG1.mp3`} loop />,
            <skoash.Audio ref="bkg2" type="background" src={`${CMWN.MEDIA.EFFECT}IntroSequnce.mp3`} loop />,
            <skoash.Audio ref="button" type="sfx" src={`${CMWN.MEDIA.EFFECT}AllButtons.mp3`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}waving-otter-2.gif`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}open-wide-otter-2.gif`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}joyful-otter-2.gif`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}antipation-otter-3.gif`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}proud-of-you-2.gif`} />,
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}peeking-through-otter-2.gif`} />,
            <div className="background-1" />,
            <div className="background-2" />,
            <div className="background-3" />,
            <div className="background-4" />,
            <div className="background-5" />,
            <div className="background-6" />,
        ]}
        onBootstrap={function () {
            this.getFriends = _.throttle(this.getData.bind(this, {name: 'getFriends'}), 1000);
            this.getMediaOnReady = _.throttle(this.getMedia.bind(this), 1000);

            this.updateState({
                path: ['collisionWarning'],
                data: {
                    show: true
                }
            });
        }}
        onReady={function () {
            this.getMediaOnReady();
            this.getFriends();
        }}
        renderMenu={function () {
            return (
                <div>
                    <div className="game-menu">
                        <button className="save" onClick={this.saveButton.bind(this)} />
                        <button
                            className="inbox"
                            onClick={this.navigator.goto.bind(this, {index: 'inbox'})}
                        />
                        <button className="create" onClick={this.create.bind(this)} />
                        <button className="help" onClick={this.navigator.openMenu.bind(this, {id: 'help'})} />
                        <button
                            className="close"
                            onClick={this.navigator.openMenu.bind(this, {id: 'quit'})}
                        />
                    </div>
                    <ul className="menu recipient">
                        <li onClick={this.clickRecipient.bind(this)}>
                            <span>
                                {this.renderRecipient()}
                            </span>
                        </li>
                    </ul>
                </div>
            );
        }}
        getGotoOpts={function (opts) {
            if (opts.index === 'send') {
                if (!this.state.recipient || !this.state.recipient.name) {
                    opts.index = 'friend';
                    opts.goto = 'send';
                }
            }
            return opts;
        }}
        passData={function (opts) {
            if (opts.name === 'add-item') {
                this.refs['screen-canvas'].addItem(opts.message);
                this.navigator.goto({ index: 'canvas' });
            } else if (opts.name === 'add-recipient') {
                this.addRecipient(opts.message, this.navigator.goto.bind(this, {
                    index: opts.goto || 'canvas'
                }));
            } else if (opts.name === 'send') {
                this.send();
            } else if (opts.name === 'showCollisionWarning') {
                this.showCollisionWarning();
            } else if (opts.name === 'showLimitWarning') {
                this.showLimitWarning();
            }
        }}
        getTriggerEvents={function (opts = {}) {
            opts.save = this.save;
            opts.getMedia = this.getMedia;
            opts.getRules = this.getRules;
            opts.loadSkribble = this.loadSkribble;
            return opts;
        }}
        getData={function (opts) {
            var names = [
                'getFriends',
                'getFriend',
                'markAsRead',
            ];

            if (names.indexOf(opts.name) === -1) {
                opts.name = 'getData';
            }

            return this.eventManager.emit(opts).then(data => {
                this.updateData({
                    data,
                    callback: opts.callback,
                });
            });
        }}
    />
);

if (module.hot) module.hot.accept();
