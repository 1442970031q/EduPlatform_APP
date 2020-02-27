var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': [],
        'isLoading': true,
        'stats': []
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'StuAttendanceLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.isLoading = false;
                    Vue.set(_vue, 'pageModule', JSON.parse(result.JsonStr));
                    _vue.stats = JSON.parse(result.StateJsonStr);
                }
            });
        },
        'gotoNewWinow': function (itme) {
            APP.GLOBAL.gotoNewWindow('main.crouse.check.list', {
                paramObject: {
                    stats: _vue.stats,
                    students: itme
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
