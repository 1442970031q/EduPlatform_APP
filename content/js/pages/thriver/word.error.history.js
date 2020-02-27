var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'activeNames': [0],
        'pageModel': {
            'list': []
        },
        'statusbarHeight': 20
    },
    methods: {
        'gotoChapter': function (item) {
            APP.GLOBAL.gotoNewWindow('../center/member/task.list.detail', {
                'param': 'stuId=' + item.Id
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'StuWordTestRecordList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var data = result.Data.replace(/\n/g, '');
                    _vue.pageModel.list = eval('(' + data + ')');
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
