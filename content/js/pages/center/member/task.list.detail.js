var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'id': APP.GLOBAL.queryString('stuId')
        },
        'pageModel': {
            'list': []
        },
        'statusbarHeight': 20,
        'isLoading': true
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'StuWordTestHistoricalRecordDetail',
                data: this.request,
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
    },
    mounted: function () {
        this.loadingPageData();
    }
});
