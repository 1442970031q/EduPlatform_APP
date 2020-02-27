var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'statusbarHeight': 20
    },
    methods: {
        'loadPageData': function () {
            //APP.GLOBAL.ajax({
            //    url: APP.CONFIG.BASE_URL + 'MyCourseList',
            //    success: function (result) {
            //        if (result.Error) {
            //            APP.GLOBAL.toastMsg(result.Msg);
            //            return;
            //        }

            //        _vue.pageModel.list = result.Data;
            //        _vue.isLoading = false;
            //    }
            //});
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
