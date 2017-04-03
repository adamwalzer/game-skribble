const classNameText = {
    character: 'character',
    header: 'header',
    yourMessageTo: 'your-message-to',
    username: 'username',
    isReady: 'is-ready',
    buttons: 'buttons',
    createAnother: 'create-another',
    inbox: 'inbox',
};

const text = {
    yourMessageTo: 'YOUR MESSAGE TO:',
    hasBeenSent: 'IS BEING SENT!',
};

class SentScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state = {
            load: true,
            opts: {
                recipient: {}
            },
        };
    }

    renderContent() {
        return (
            <div>
                <skoash.Audio ref="start" type="sfx" src={`${CMWN.MEDIA.EFFECT}SendSkribble.mp3`} />
                <div className={classNameText.character} />
                <div className={classNameText.header}>
                    <span className={classNameText.yourMessageTo}>{text.yourMessageTo}</span>
                    <span className={classNameText.username}>{this.state.opts.recipient.name}</span>
                    <br/>
                    <span className={classNameText.isReady}>{text.hasBeenSent}</span>
                </div>
                <div className={classNameText.buttons}>
                    <button
                        className={classNameText.createAnother}
                        onClick={this.goto.bind(this, 'friend')}
                    />
                    <button
                        className={classNameText.inbox}
                        onClick={this.goto.bind(this, 'inbox')}
                    />
                </div>
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <SentScreen
            {...props}
            ref={ref}
            key={key}
            id="sent"
            hideNext
            hidePrev
        />
    );
}
