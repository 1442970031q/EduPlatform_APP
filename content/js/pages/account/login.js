var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isAutoLogin': false,
        'isLogin': false,
        'request': {
            'closeonly': APP.GLOBAL.queryString('closeonly')
        },
        'form': {
            'account': '410325200201064518',
            'pwd': '~064518',
            'os': APP.CONFIG.SYSTEM_NAME,
            'clientId': ''
        },
        'statusbarHeight': 20
    },
    methods: {
        'checkInput': function () {
            if (!this.form.account) {
                APP.GLOBAL.toastMsg('请输入您的身份证号码');
            } else if (this.form.account.length !== 18) {
                APP.GLOBAL.toastMsg('请输入您的完整身份证号码');
            } else if (!this.form.pwd) {
                APP.GLOBAL.toastMsg('请输入您的登录密码');
            } else if (this.form.pwd.length < 6) {
                APP.GLOBAL.toastMsg('登录密码不能小于6位');
            } else {
                this.isLogin = true;
                setTimeout(this.doSubmitAjax, 300);
            }
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'Login',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        _vue.isLogin = false;
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var obj = {
                        'Key': result.Key
                    };
                    obj = Object.assign(obj, result.UserData);
                    APP.GLOBAL.updateUserModel(obj);

                    if (_vue.isAutoLogin) {
                        APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.AUTO_LOGIN_KEY, 'true');
                        APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY, _vue.form.account + '\t' + _vue.form.pwd);
                    } else {
                        APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.AUTO_LOGIN_KEY, 'false');
                        APP.GLOBAL.removeItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY);
                    }

                    if (!APP.CONFIG.IS_RUNTIME) {
                        _vue.isLogin = false;
                        _vue.$toast.success('登录成功');
                        return;
                    }

                    if (_vue.request.closeonly) {
                        for (var i = 0; i < APP.CONFIG.SUB_PAGES.length; i++) {
                            var wb = plus.webview.getWebviewById(APP.CONFIG.SUB_PAGES[i].pageName + 'Page');
                            if (wb !== null) {
                                wb.evalJS('_vue.updateUser()');
                            }
                        }

                        APP.GLOBAL.closeWindow();
                    } else {
                        APP.GLOBAL.gotoNewWindow('../main', {
                            'openCallback': function () {
                                APP.GLOBAL.closeWindow('none');
                            },
                            'ani': 'none'
                        });
                    }
                }
            });
        }
    },
    computed: {
        'publicVersion': function () {
            return 'v' + numberFormat(APP.CONFIG.VERSION / 10, 1);
        },
        'screenHeight': function () {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                return plus.display.resolutionHeight;
            } else {
                return document.body.clientHeight;
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
            this.form.clientId = plus.push.getClientInfo().clientid;
        }

        if (this.request.closeonly) {
            window.backButton = function () {
                APP.GLOBAL.toastMsg('请登录您的账号');
            };
        }
    },
    mounted: function () {
        var autoLogin = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.AUTO_LOGIN_KEY);
        this.isAutoLogin = autoLogin === 'true';

        if (this.isAutoLogin) {
            var loginInfo = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY).toString().split('\t');
            this.form.account = loginInfo[0];
            this.form.pwd = loginInfo[1];
        }
    }
});
