var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': {
            'State': 0,
            'students': {
                'Data': [{ 'State': 0 }, { 'State': 1}, {}]
            }
        },
        'form': {
            'tpId': '',
            'segNum': '',
            'sId': '',
            'state': '',
            'remarks': ''
        },
        'index': ''
    },
    methods: {
        'sigin': function (item, index) {
            this.form.sId = item.StudentId;
            this.form.state = 1;
            this.index = index;
            this.submitAjax();
        },
        'submitAjax': function () {
            APP.GLOBAL.toastLoading('正在签到');
          
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RegistrationStuAttendance',
                data: this.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModule.students.Data[_vue.index].State = _vue.form.state;

                    if (APP.CONFIG.IS_RUNTIME) {
                        var wb = plus.webview.getWebviewById('main.crouse.checkPage');
                        wb.evalJS('_vue.loadingPageData()');
                    }
                }
            });
        },
        'amendCallBack': function (state, remek) {
            this.form.state = state;
            this.form.remarks = remek;

            this.submitAjax();
        },
        'gotoAmend': function (item, index, t) {
            this.form.sId = item.StudentId;
            this.index = index;
            var obj = {
                title: t === 1 ? '修改考勤' : '其它',
                segNum: this.form.segNum,
                name: item.StudentName,
                nowstate: item.State,
                remarks: item.Remarks
            };

            APP.GLOBAL.gotoNewWindow('main.crouse.check.amend', {
                param: 'obj=' + JSON.stringify(obj)
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            this.pageModule = wb.paramObject;
        }

        this.form.tpId = this.pageModule.students.TermPlanId;
        this.form.segNum = this.pageModule.students.SegNum;
    }
});
