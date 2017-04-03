import classNames from 'classnames';

import Selectable from '../../shared/components/selectable/0.1.js';

const classNameText = {
    skribbleBox: 'skribble-box',
    box: 'box',
    leftMenu: 'menu left-menu',
    rightMenu: 'menu right-menu',
    sender: 'menu recipient sender',
};

const refs = {
    box: 'box',
};

class ReadScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state.load = true;
        this.state.message = {user: {}};

        this.leftMenuList = [
            <li className="inbox" onClick={this.goto.bind(this, 'inbox')}>
                <span />
            </li>
        ];

        this.rightMenuList = [
            <li className="reply" onClick={this.reply.bind(this)}>
                <span />
            </li>
        ];
    }

    reply() {
        skoash.trigger('passData', {
            name: 'add-recipient',
            message: this.state.message.created_by,
        });
    }

    open(opts) {
        var message;
        var friends;
        var creater;

        message = opts.message || {};

        friends = this.props.gameState.data.user || [];
        friends.forEach(friend => {
            if (message.created_by === friend.friend_id) {
                creater = friend;
            }
        });

        this.setState({
            load: true,
            open: true,
            leave: false,
            close: false,
            message,
            creater
        });

        this.start();

        skoash.trigger('getData', {
            name: 'markAsRead',
            'skribble_id': message.skribble_id,
        });
    }

    getSenderClassNames() {
        return classNames(
      classNameText.sender, {
          HIDE: !this.state.creater || this.state.message.sent
      }
    );
    }

    renderSender() {
        var creater;
        var content = [];

        creater = this.state.creater;

        if (!creater) return;

        if (creater.username) {
            content.push(<span className="name">{creater.username}</span>);
        }

        if (creater._embedded.image) {
            content.push(<img className="profile-image" src={creater._embedded.image.url} />);
        }

        return content;
    }

    renderBoxContent() {
        var url = _.get(this.state, 'message.url');

        if (!url) return null;

        return [
            <skoash.Image src={this.state.message.url} />,
            <div className={classNameText.box} />,
        ];
    }

    renderContent() {
        return (
            <div>
                <skoash.Audio ref="start" type="sfx" src={`${CMWN.MEDIA.EFFECT}PreviewOpen.mp3`} />
                <ul className={this.getSenderClassNames()}>
                    <li>
                        <span>
                            {this.renderSender()}
                        </span>
                    </li>
                </ul>
                <skoash.Component ref={refs.box} className={classNameText.skribbleBox}>
                    {this.renderBoxContent()}
                </skoash.Component>
                <Selectable className={classNameText.leftMenu} list={this.leftMenuList} />
                <Selectable className={classNameText.rightMenu} list={this.rightMenuList} />
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <ReadScreen
            {...props}
            ref={ref}
            key={key}
            id="read"
            hideNext
            hidePrev
        />
    );
}
