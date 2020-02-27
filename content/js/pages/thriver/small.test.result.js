var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'score': APP.GLOBAL.queryString('score'),
            'eCount': APP.GLOBAL.queryString('eCount'),
            'qCount': APP.GLOBAL.queryString('qCount'),
            'tId': APP.GLOBAL.queryString('tId')
        },
        'statusbarHeight': 20
    },
    methods: {
        'clearTemp': function () {
            APP.GLOBAL.removeItem(APP.CONFIG.SYSTEM_KEYS.TEMP_QUESTION_LIST_KEY);

            if (APP.CONFIG.IS_RUNTIME) {
                plus.webview.currentWebview().close('auto');
            }
        },
        'gotoResolve': function () {
            if (this.request.eCount * 1 <= 0) {
                APP.GLOBAL.toastMsg('没有错误题目');
                return;
            }

            APP.GLOBAL.gotoNewWindow('error.resolve', {
                'param': 'tId=' + this.request.tId + '&ec=' + this.request.eCount
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        window.onPageClose = this.clearTemp;
    }
});
