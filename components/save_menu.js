class SaveMenu extends skoash.Screen {
    cancel() {
        this.close();
        skoash.trigger('menuClose', {
            id: this.props.id,
        });
    }

    render() {
        return (
            <div id={this.props.id} className={this.getClassNames()}>
                <skoash.Audio ref="start" type="sfx" src={`${CMWN.MEDIA.EFFECT}SaveSkribble.mp3`} />
                <div className="center">
                    <div className="frame">
                        <button className="quit-saved" onClick={this.cancel.bind(this)}></button>
                        <h2>Your progress</h2>
                        <h2>has been saved</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default (
    <SaveMenu
        id="save"
        load
    />
);
