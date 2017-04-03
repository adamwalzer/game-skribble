import Selectable from '../../shared/components/selectable/0.1.js';

const classNameText = {
    yourMessageTo: 'your-message-to',
    isReady: 'is-ready',
    changeFriend: 'change-friend',
    character: 'character',
    gift: 'gift',
    header: 'header',
    username: 'username',
};

class SendScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state.load = true;
        this.state.recipient = {};

        this.rightMenuList = [
            <li className="edit-right" onClick={this.goto.bind(this, 'canvas')}>
                <span />
            </li>,
            <li className="send" onClick={this.send}>
                <span />
            </li>
        ];
    }

    open() {
        var recipient = this.props.gameState.recipient || {};

        this.setState({
            load: true,
            open: true,
            leave: false,
            close: false,
            recipient
        });

        this.start();
    }

    send() {
        skoash.trigger('passData', {
            name: 'send',
        });
    }

    renderContent() {
        var changeFriendClick = this.goto.bind(this, {
            index: 'friend',
            goto: 'send',
        });

        return (
            <div>
                <div className={classNameText.header}>
                    <span className={classNameText.yourMessageTo} />
                    <span className={classNameText.username}>{this.state.recipient.name}</span>
                    <br/>
                    <span className={classNameText.isReady} />
                    <button className={classNameText.changeFriend} onClick={changeFriendClick} />
                </div>
                <div className={classNameText.character}>
                    <skoash.Image className="otter" src={`${CMWN.MEDIA.SPRITE}proud-of-you-2.gif`} />
                    <div className="bubble">
                        Are you sure<br/>
                        you are ready to<br/>
                        send your message?
                    </div>
                </div>
                <div className={classNameText.gift} />
                <Selectable className="menu right-menu" list={this.rightMenuList} />
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <SendScreen
            {...props}
            ref={ref}
            key={key}
            id="send"
            hideNext
            hidePrev
        />
    );
}
