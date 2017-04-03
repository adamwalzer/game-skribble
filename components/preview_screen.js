import Canvas from 'shared/components/canvas/0.1';
import Selectable from 'shared/components/selectable/0.1.js';
import Repeater from 'shared/components/repeater/0.1.js';

const classNameText = {
    skribbleBox: 'skribble-box',
    box: 'box',
    leftMenu: 'menu left-menu',
    rightMenu: 'menu right-menu',
};

const refs = {
    box: 'box',
    canvas: 'canvas'
};

class PreviewScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state = {
            load: true,
            opts: {},
        };

        this.leftMenuList = [
            <li className="edit" onClick={this.goto.bind(this, 'canvas')}>
                <span />
            </li>,
        ];

        this.rightMenuList = [
            <li className="send" onClick={this.goto.bind(this, 'send')}>
                <span />
            </li>
        ];
    }

    open(opts) {
        skoash.trigger('getRules').then(rules => {
            this.refs[refs.box].refs[refs.canvas].setItems(rules);
            super.open(opts);
        });
    }

    renderContent() {
        return (
            <div>
                <skoash.Audio ref="start" type="sfx" src={`${CMWN.MEDIA.EFFECT}PreviewOpen.mp3`} />
                <skoash.Component ref={refs.box} className={classNameText.skribbleBox}>
                    <Canvas ref={refs.canvas} preview />
                    <Repeater
                        className="sparkles"
                        amount={40}
                    />
                    <div className={classNameText.box} />
                </skoash.Component>
                <Selectable className={classNameText.leftMenu} list={this.leftMenuList} />
                <Selectable className={classNameText.rightMenu} list={this.rightMenuList} />
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <PreviewScreen
            {...props}
            ref={ref}
            key={key}
            id="preview"
            hideNext
            hidePrev
        />
    );
}
