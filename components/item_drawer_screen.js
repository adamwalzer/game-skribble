import ItemDrawer from '../../shared/components/item_drawer/0.1.js';

class ItemDrawerScreen extends skoash.Screen {
    constructor() {
        super();

        this.state = {
            load: true,
            opts: {
                categories: [],
            },
        };

    }

    selectRespond(message) {
        skoash.trigger('passData', {
            name: 'add-item',
            message
        });
    }

    updateData(d) {
        var data = d ? d : this.props.gameState.data.menu.items;

        this.state.opts.categories.forEach(key => {
            if (data[key]) data = data[key];
            if (data.items) data = data.items;
        });

        data = _.values(data);

        this.setState({
            data,
        });
    }

    open(opts) {
        this.setState({
            load: true,
            open: true,
            leave: false,
            close: false,
            opts,
            data: null
        }, () => {
            this.updateData();
        });

        setTimeout(() => {
            if (!this.state.started) this.start();
        }, 250);
    }

    cancelRespond() {
        if (this.state.category) {
            this.setState({
                category: '',
                categoryName: '',
            });
        } else {
            skoash.trigger('goto', {index: 'canvas'});
        }
    }

    renderContent() {
        return (
            <div>
                <ItemDrawer
                    ref="drawer"
                    scrollbarImg={`${CMWN.MEDIA.IMAGE}sk-btn-slider.png`}
                    selectRespond={this.selectRespond.bind(this)}
                    cancelRespond={this.cancelRespond}
                    categories={this.state.opts.categories}
                    categoryName={this.state.opts.categoryName}
                    data={this.state.data}
                />
            </div>
        );
    }
}

export default function (props, ref, key) {
    return (
        <ItemDrawerScreen
            {...props}
            ref={ref}
            key={key}
            id="item-drawer"
            hideNext
            hidePrev
        />
    );
}
