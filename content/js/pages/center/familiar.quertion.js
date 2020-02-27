var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'activeNames': ['0'],
        'isLoading': true,
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'list': []
        }
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CommonProblemList',
                data: {
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
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

        this.loadingPageData();
    }
});