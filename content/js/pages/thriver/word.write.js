var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'statusbarHeight': 20,
        'pageModel': {
            'list':[]
        }
    },
    methods: {
        'gotoDetail': function (item) {
            if (item.BeginTime > item.SerTime) {
                APP.GLOBAL.toastMsg('该听写还未开始');
            } else {
                APP.GLOBAL.gotoNewWindow('word.write.detail', {
                    'param': 'wId=' + item.Id
                });
            }
        },
        'padLeft': function (v) {
            if (v.toString().length < 2) {
                return '0' + v;
            } else {
                return v;
            }
        },
        'getTotalTime': function (sec) {
            var h = Math.floor(sec % (60 * 60 * 24) / (60 * 60));
            var m = Math.floor(sec % (60 * 60) / 60);
            var s = Math.floor(sec % 60);
            return this.padLeft(h) + ':' + this.padLeft(m) + ':' + this.padLeft(s);
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WordTestList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'reloadList': function () {
            this.isLoading = true;
            this.pageModel.list = [];

            this.loadPageData();
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
