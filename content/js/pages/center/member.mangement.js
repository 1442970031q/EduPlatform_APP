var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': {
            'tab_1': {
                'loadUrl': 'LabWorkLoadData',
                'isLoading': true,
                'callBack': 'callback_1',
                'form': {},
                'data': []
            },
            'tab_2': {
                'loadUrl': 'StuWordTestLoadData',
                'isLoading': true,
                'callBack': 'callback_2',
                'data': [],
                'form': {}
            }
        },
        'tabIndex': 0,
        'tab': {},
        'value': 0
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + this.tab.loadUrl,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue[_vue.tab.callBack](result);
                }
            });
        },
        'changeTabs': function (index, title) {
            if (this.currentUser.IsGroupLeader && this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative && index === 0) {
                return;
            }
            else if(this.currentUser.IsGroupLeader && this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative) {
                this.tab = this.pageModule['tab_' + index];
                this.loadPageData();
            } else if (this.currentUser.IsGroupLeader && !this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative) {
                this.tab = this.pageModule['tab_' + (index + 1)];
                this.loadPageData();
            } else if (!this.currentUser.IsGroupLeader && this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative) {
                if (index == 1) {
                    this.tab = this.pageModule.tab_2;
                    this.loadPageData();
                }
            } else if (this.currentUser.IsGroupLeader && this.currentUser.IsDisciplinaryCommissioner && !this.currentUser.IsEnglishRepresentative) {
                if (index == 1) {
                    this.tab = this.pageModule.tab_1;
                    this.loadPageData();
                }
            }
        },
        'firstLoadding': function (index, title) {
            this.tab = this.pageModule['tab_' + index];
            this.loadPageData();
        },
        'callback_1': function (result) {
            this.tab.data = JSON.parse(result.JsonStr);
            this.tab.isLoading = false;
        },
        'callback_2': function (result) {
            this.tab.data = result.Data;
            this.tab.isLoading = false;
        },
        'submitWorkAjax': function (index) {
            this.tab.form = {
                tpId: this.tab.data[index].TermPlanId,
                jsonStr: JSON.stringify(this.tab.data[index].Data)
            };

            APP.GLOBAL.toastLoading('正在提交');
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RegistrationLabWorkFinish',
                data: this.tab.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.loadPageData();
                    _vue.$toast.success('提交成功');
                }
            });
        },
        'gotoSetPage': function (item) {
            APP.GLOBAL.gotoNewWindow(item.IsTested ? 'member/task.list' : 'member/set.word.test', {
                param: 'tId=' + item.Id
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        if (this.currentUser.IsGroupLeader && this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative ) {
            return;
        } else if (this.currentUser.IsGroupLeader && !this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative ) {
            this.firstLoadding(1);
            return;
        } else if (!this.currentUser.IsGroupLeader && !this.currentUser.IsDisciplinaryCommissioner && this.currentUser.IsEnglishRepresentative) {
            this.firstLoadding(2);
            return;
        } else if (this.currentUser.IsGroupLeader && !this.currentUser.IsDisciplinaryCommissioner && !this.currentUser.IsEnglishRepresentative) {
            this.firstLoadding(1);
            return;
        }
    }
});
