import ItemDrawer from 'shared/components/item_drawer/0.1.js';

const DEFAULT_PROFILE_IMAGE = 'https://changemyworldnow.com/ff50fa329edc8a1d64add63c839fe541.png';

class FriendScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state = {
            load: true,
            complete: true,
            recipient: {},
            opts: {},
        };
    }

    selectRespond(message) {
        skoash.trigger('passData', {
            name: 'add-recipient',
            goto: this.state.opts.goto,
            message
        });
    }

    updateData(d) {
        var data = d && d.user ? d.user : this.props.gameState.data.user || [];

        data = data.map(friend => {
            var src = friend._embedded.image && friend._embedded.image.url ?
                friend._embedded.image.url :
                DEFAULT_PROFILE_IMAGE;
            return {
                'user_id': friend.friend_id,
                name: friend.username,
                src,
                // I need to get the flips earned back from the backend to do this.
                description: '',
                // description: friend.flips_earned + ' Flips Earned',
                'asset_type': 'friend',
            };
        });

        this.setState({
            data,
        });
    }

    open(opts) {
        var recipient;
        var self = this;

        self.updateData();

        skoash.trigger('getData', {
            name: 'getFriends'
        }).then(data => {
            self.updateData.call(self, data);
        });

        recipient = self.props.gameState.recipient;

        self.setState({
            load: true,
            open: true,
            leave: false,
            close: false,
            recipient,
            opts,
        }, () => {
            self.refs.drawer && self.refs.drawer.start();
        });

        if (!self.state.started) {
            self.start();
        }
    }

    suggestFriends() {
        window.open(
            window.location.origin
            .replace('games-', '')
            .replace('games.', '') +
            '/friends/suggested'
        );
    }

    save() {
        skoash.trigger('goto', {
            index: 'canvas',
        });
        skoash.trigger('openMenu', {id: 'save'});
    }

    renderOtter() {
        var copy;
        var src;
        var imageSrc;

        src = 'One';
        imageSrc = `${CMWN.MEDIA.IMAGE}otter-static-greeting-one.png`;
        copy = (
            <span>
                Don't have<br/>
                friends yet?<br/><br/>
                Let me suggest<br/>
                some for you.
            </span>
        );

        if (this.state.data && this.state.data.length) {
            src = 'Two';
            imageSrc = `${CMWN.MEDIA.SPRITE}open-wide-otter-2.gif`;
            copy = (
                <span>
                    Let me find a friend<br/>
                    to send your message to.
                </span>
            );
        }

        return (
            <div className={'otter-container ' + src}>
                <skoash.Image className="otter" src={imageSrc} />
                <div className="bubble">
                    {copy}
                </div>
            </div>
        );
    }

    renderFriends() {
        if (this.state.data && this.state.data.length) {
            return (
                <ItemDrawer
                    ref="drawer"
                    scrollbarImg={`${CMWN.MEDIA.IMAGE}sk-btn-slider.png`}
                    selectRespond={this.selectRespond.bind(this)}
                    cancelRespond={this.back}
                    categories={this.state.opts.categories}
                    data={this.state.data}
                    selectedItem={this.state.recipient}
                    buttons={this.buttons}
                    completeOnStart={true}
                    checkComplete={false}
                    className={'goto-' + this.state.opts.goto}
                />
            );
        }

        return (
            <div className={'goto-' + this.state.opts.goto}>
                <skoash.Audio ref="vo" type="voiceOver" src={`${CMWN.MEDIA.VO}FindFriendSend.mp3`} />
                <div className="item-drawer-container">
                    <div className="suggest-friends-buttons">
                        <button className="continue" onClick={this.selectRespond.bind(this, {})} />
                        <button className="suggest" onClick={this.suggestFriends} />
                        <button className="save-to-drafts" onClick={this.save} />
                    </div>
                </div>
            </div>
        );
    }

    renderContent() {
        return (
            <div>
                <div className="header" />
                {this.renderOtter()}
                {this.renderFriends()}
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <FriendScreen
            {...props}
            ref={ref}
            key={key}
            id="friends"
            completeOnStart
            checkComplete={false}
            hideNext
            hidePrev
        />
    );
}
