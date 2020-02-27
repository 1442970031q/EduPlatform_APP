var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'checked': true,
        'fileTotalSize': 0,
        'form': {
            'coin': ''
        },
        'sum': 0
    },
    methods: {
        'checkData': function () {
            if (this.form.coin * 1 < 1) {
                APP.GLOBAL.toastMsg('兑换不能小于1云币');
            } else if (this.currentUser.ResidualIntegral < this.sum) {
                APP.GLOBAL.toastMsg('积分不足');
            } else {
                APP.GLOBAL.confirmMsg({
                    'title': '云币兑换',
                    'message': '是否花费 ' + this.sum + ' 积分兑换 ' + this.form.coin + ' 云币？',
                    'confirmCallback': this.exchangeAjax
                });
            }
        },
        'exchangeAjax': function () {
            APP.GLOBAL.toastLoading('正在兑换');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ExchangeCoin',
                data: this.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.currentUser.YSDCoin = _vue.currentUser.YSDCoin + _vue.form.coin;
                    _vue.currentUser.ResidualIntegral = _vue.currentUser.ResidualIntegral - _vue.sum;
                    APP.GLOBAL.updateUserModel(_vue.currentUser);
                    _vue.currentUser = APP.GLOBAL.getUserModel();
                    var integarlWb = plus.webview.getWebviewById('integralPage');
                    var centerlWb = plus.webview.getWebviewById('center.htmlPage');
                    integarlWb.evalJS('_vue.updatePage()');
                    centerlWb.evalJS('_vue.updatePage()');
                    _vue.form.coin = 0;
                    APP.GLOBAL.gotoNewWindow('exchange.coin.success');
                }
            });
        }
    },
    computed: {
        'sumIntegal': function () {
            if (this.form.coin && this.form.coin * 1 > 0) {
                this.sum = this.form.coin * 1 * this.currentUser.CoinExchangeIntegral;
                return numberFormat(this.sum, 0);
            } else {
                return '请先输入云币数量';
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    }
});
