var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'tpId': APP.GLOBAL.queryString('tId')
        },
        'pageModel': {
            'list':[]
        },
        'searchValue':'',
        'statusbarHeight': 20,
        'isLoading': true
    },
    methods: {
        'onCancel': function () {
            for (var i = 0; i < this.pageModel.list.length; i++) {
                this.pageModel.list[i].isShow = true;
            }
        },
        'onSearch': function () {
            if (!this.searchValue) {
                APP.GLOBAL.toastMsg('请输入姓名');
            } else {
                this.searchName();
            }
        },
        'searchName': function () {
            for (var i = 0; i < this.pageModel.list.length; i++) {
                if (this.pageModel.list[i].RealName.indexOf(this.searchValue) !== -1) {
                    this.pageModel.list[i].isShow = true;
                } else {
                    this.pageModel.list[i].isShow = false;
                }
            }
        },
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'StuWordTestHistoricalRecord',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < result.Data.length; i++) {
                        result.Data[i]['isShow'] = true;
                    }
                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'gotoDetail': function (item) {
            if (item.Id === 0) {
                APP.GLOBAL.toastMsg('该学员还未提交');
                return;
            }

            APP.GLOBAL.gotoNewWindow('task.list.detail', {
                'param': 'stuId=' + item.Id
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
