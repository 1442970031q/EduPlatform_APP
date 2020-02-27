var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'pageModel': {
            'CMonthPassRate': 0,
            'CMonthPassRatePM': 0,
            'CMonthSTNum': 0,
            'CMonthSTNumPM': 0,
            'list': []
        },
        'statusbarHeight': 20
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'BrushExerciseStatistics',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.CMonthPassRate = result.CMonthPassRate;
                    _vue.pageModel.CMonthPassRatePM = result.CMonthPassRatePM;
                    _vue.pageModel.CMonthSTNum = result.CMonthSTNum;
                    _vue.pageModel.CMonthSTNumPM = result.CMonthSTNumPM;
                    _vue.pageModel.list = JSON.parse(result.JsonStr);
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
