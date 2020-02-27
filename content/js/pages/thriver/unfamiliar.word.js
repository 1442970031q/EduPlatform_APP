var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 20,
            'isLoadMore': false,
            'isLoadComplete': false,
            'list': []
        },
        'statusbarHeight': 20
    },
    methods: {
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('unfamiliar.word.detail', {
                'paramObject': {
                    'word': item
                }
            });
        },
        'loadPageData': function () {
            this.isLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'NewWordsList',
                data: {
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadPageData();
    }
});
