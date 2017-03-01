export default function (props, ref, key) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="title"
            hidePrev
            nextDelay={1000}
            nextIndex="menu"
            backgroundAudio="bkg2"
        >
            <skoash.Image
                ref="title"
                className="title animated"
                src={`${CMWN.MEDIA.IMAGE}skribble-title.png`}
            />
            <skoash.Image
                ref="play"
                className="hidden"
                src={`${CMWN.MEDIA.IMAGE}skribble-play-01.png`}
            />
            <skoash.Image
                ref="play-hover"
                className="hidden"
                src={`${CMWN.MEDIA.IMAGE}skribble-hover.png`}
            />
        </skoash.Screen>
    );
}
