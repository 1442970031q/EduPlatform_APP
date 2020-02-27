var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': [],
        'obj': JSON.parse(APP.GLOBAL.queryString('obj')),
        'module': {
            'state': '',
            'remek': '',
            'isAmend': false
        },
        'columns': [],
        'show': false,
        'isLoading': true
    },
    methods: {
        'onConfirm': function (item) {
            this.module.state = item.Key;
            this.show = false;
        },
        'closewindow': function () {
            APP.GLOBAL.confirmMsg({
                'title': '确认提交',
                'message': '是否提交？',
                'confirmCallback': function () {
                    if (_vue.obj.title == '修改考勤') {
                        _vue.module.isAmend = true;
                    }
                    var wb = plus.webview.getWebviewById('public.crouse.check.listPage');
                    wb.evalJS('_vue.amendCallBack(' + JSON.stringify(_vue.module) + ')');
                    APP.GLOBAL.closeWindow();
                }
            })

        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GetAttendanceState',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'columns', JSON.parse(result.JsonStr))
                    _vue.isLoading = false;
                }
            });
        }
    },
    computed: {
        'state': function () {
            var str = ''
            switch (this.module.state) {
                case 0:
                    str = '未选择'
                    break;
                case 1:
                    str = '正常'
                    break;
                case 2:
                    str = '迟到'
                    break;
                case 3:
                    str = '早退'
                    break;
                case 4:
                    str = '病假'
                    break;
                case 5:
                    str = '事假'
                    break;
                case 6:
                    str = '旷课'
                    break;
            }
            return str
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
        this.loadPageData();
        this.module.state = this.obj.nowstate;
        this.module.remek = this.obj.remarks;
        this.module.state = 1;
    }
});
