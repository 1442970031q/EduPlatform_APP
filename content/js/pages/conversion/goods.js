Vue.use(vant.Lazyload, {
    'loading': '../../content/img/conversion/default_conversion_block.jpg?v=2',
    'error': '../../content/img/conversion/default_conversion_block.jpg?v=2',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'statusbarHeight': 20,
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'ty': APP.GLOBAL.queryString('type')
        },
        'pageModel': {
            'data': '',
            'isLoadMore': false,
            'isLoadComplete': false
        }
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GoodsList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.form.pageIndex++;
                    _vue.pageModel.data = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'gotoDetailPage': function (id) {
            APP.GLOBAL.gotoNewWindow('product.detail', {
                param: 'pId=' + id
            });
        },
        'closeWindow': function () {
            APP.GLOBAL.closeWindow();
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GoodsList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.form.pageIndex++;
                    _vue.pageModel.data = _vue.pageModel.data.concat(result.Data);
                    _vue.pageModel.isLoadMore = false;
                    if (result.Data.length < _vue.form.pageSize) {
                        _vue.pageModel.isLoadComplete = true;
                    }
                }
            });
        },
        'scrollBottom': function () {
            if (!this.pageModel.isLoadMore && !this.pageModel.isLoadComplete) {
                this.pageModel.isLoadMore = true;
                this.loadMore();
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
