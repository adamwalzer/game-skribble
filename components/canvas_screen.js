import Canvas from 'shared/components/canvas/0.1';
import Menu from 'shared/components/menu/0.1';
import Selectable from 'shared/components/selectable/0.1';
// import Reveal from 'shared/components/reveal/0.1';

import classNames from 'classnames';

class CanvasScreen extends skoash.Screen {
    constructor() {
        super();

        this.state = {
            load: true,
            menu: {},
            valid: true,
        };

        this.rightMenuList = [
            <li className="preview" onClick={this.preview.bind(this)}>
                <span />
            </li>,
            <li className="send" onClick={this.send.bind(this)}>
                <span />
            </li>
        ];

        this.setValid = this.setValid.bind(this);
        this.closeReveal = this.closeReveal.bind(this);
        this.setHasAssets = this.setHasAssets.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    bootstrap() {
        super.bootstrap();

        this.menuDOM = ReactDOM.findDOMNode(this.refs.menu);
    }

    getData() {
        return this.refs.canvas.getItems();
    }

    reset() {
        this.refs.canvas.reset();
        this.setState({
            background: false,
            hasAssets: false,
        });
    }

    addItem(message) {
        if (message) {
            this.setState({
                hasAssets: true,
                background: this.state.background ||
              message.asset_type === 'background',
            });
            this.refs.canvas.addItem(message, () => {
                skoash.trigger('save');
            });
        }
    }

    addItems(message) {
        var hasAssets;
        var background;

        hasAssets = true;
        background = !!message.rules.background;

        this.mapRulesStringToNumbers(message.rules);

        this.refs.canvas.setItems(message.rules);

        this.setState({
            hasAssets,
            background,
        });

        if (message.friend_to) {
            skoash.trigger('passData', {
                name: 'add-recipient',
                message: message.friend_to
            });
        }
    }

    setMenu() {
        var menu;
        var state = this.props.gameState;

        if (state && state.data && state.data.menu) {
            menu = state.data.menu;
            this.setState({
                menu,
            });
        }
    }

    mapRulesStringToNumbers(rules) {
        if (!rules) return;

        if (_.isArray(rules.items)) {
            rules.items.forEach(item => {
                item.state.left = parseFloat(item.state.left);
                item.state.rotation = parseFloat(item.state.rotation);
                item.state.scale = parseFloat(item.state.scale);
                item.state.top = parseFloat(item.state.top);
            });
        }

        if (_.isArray(rules.messages)) {
            rules.messages.forEach(message => {
                message.state.left = parseFloat(message.state.left);
                message.state.rotation = parseFloat(message.state.rotation);
                message.state.scale = parseFloat(message.state.scale);
                message.state.top = parseFloat(message.state.top);
            });
        }

        return rules;
    }

    open(opts = {}) {
        this.setMenu();

        if (this.refs && this.refs.menu) {
            this.refs.menu.deactivate();
        }

        if (!opts.draft) skoash.trigger('save');

        super.open();
    }

    close() {
        skoash.trigger('save');
        super.close();
    }

    setValid(valid) {
        this.setState({
            valid
        });
    }

    setHasAssets(hasAssets) {
        this.setState({
            hasAssets
        });
    }

    send() {
        if (!this.state.valid) return;
        this.goto('send');
    }

    preview() {
        if (!this.state.valid) return;
        this.goto('preview');
    }

    closeReveal() {
        if (this.refs && this.refs.reveal) {
            this.refs.reveal.close();
        }
    }

    onMouseOver(e) {
        let li = e.target.closest('LI');
        let ul = e.target.closest('UL');

        if (ul === this.menuDOM) {
            if (!_.includes(li.className, 'SELECTED')) this.playMedia('slide');
        } else {
            this.playMedia('highlight');
        }
    }

    getContainerClasses() {
        return classNames({
            'canvas-container': true,
            BACKGROUND: this.state.background,
        });
    }

    getClassNames() {
        return classNames({
            'HAS-ASSETS': this.state.hasAssets,
            'INVALID': !this.state.valid,
        }, skoash.Screen.prototype.getClassNames.call(this));
    }

    renderContent() {
        return (
            <div>
                <skoash.Audio ref="slide" type="sfx" src={`${CMWN.MEDIA.EFFECT}MenuSlide.mp3`} />
                <skoash.Audio ref="highlight" type="sfx" src={`${CMWN.MEDIA.EFFECT}Highlight.mp3`} />
                <skoash.Image className="hidden" src={`${CMWN.MEDIA.FRAME}sk-frames-canvas.png`} />
                <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}sk-btn-friend.png`} />
                <Menu
                      ref={'menu'}
                      items={this.state.menu.items}
                      level={0}
                      lastLevel={1}
                      onStart={function () {
                          this.setState({classes: {}});
                      }}
                      onMouseOver={this.onMouseOver}
                />
                <div className={this.getContainerClasses()}>
                      <Canvas
                            ref={'canvas'}
                            setValid={this.setValid}
                            setHasAssets={this.setHasAssets}
                            itemMinDim={150}
                      />
                </div>
                <Selectable className="menu right-menu" list={this.rightMenuList} />
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <CanvasScreen
            {...props}
            ref={ref}
            key={key}
            id="canvas"
            hideNext
            hidePrev
        />
    );
}
