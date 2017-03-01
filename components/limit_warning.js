export default (
    <skoash.Screen
        id="limitWarning"
        load
        hidePrev
        hideNext
    >
        <skoash.Audio ref="start" type="sfx" src={`${CMWN.MEDIA.EFFECT}TooManyWarning.mp3`} />
        <skoash.Image className="hidden" src={ENVIRONMENT.MEDIA + 'a479811171cf084bf86af4eac1f6dc28.png'} />
        <skoash.Image className="hidden" src={ENVIRONMENT.MEDIA + '027b30f0d279ef41cd30eff22323051c.png'} />
        <skoash.Image className="otter" src={ENVIRONMENT.MEDIA + 'e7c3a0ab64b457334e7be868609ee512.png'} />
        <skoash.Image className="sign" src={ENVIRONMENT.MEDIA + '7434453a4692d4be9e898b6b8787c108.png'} />
        <div>
            WARNING:<br/>
            You have exceeded the number of times<br/>
            you can use this item in your message.<br/>
            Please press ok to continue game.
        </div>
        <button
            onClick={function () {
                skoash.trigger('menuClose', {
                    id: 'limitWarning',
                });
            }}
        />
    </skoash.Screen>
);
