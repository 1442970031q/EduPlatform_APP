var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'request': {
            'score': APP.GLOBAL.queryString('score'),
            'eCount': APP.GLOBAL.queryString('eCount'),
            'qCount': APP.GLOBAL.queryString('qCount'),
            'title': APP.GLOBAL.queryString('title'),
            'bEId': APP.GLOBAL.queryString('bEId'),
            'rat': APP.GLOBAL.queryString('rat')
        }
	},
    methods: {
        'clearTemp': function () {
            APP.GLOBAL.removeItem(APP.CONFIG.SYSTEM_KEYS.TEMP_QUESTION_LIST_KEY);

            if (APP.CONFIG.IS_RUNTIME) {
                plus.webview.currentWebview().close('auto');
            }
        },
        'gotoErrorResolve': function () {
            APP.GLOBAL.gotoNewWindow('error.resolve', {
                'param': 'bEId=' + this.request.bEId
            });
        }
    },
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        window.onPageClose = this.clearTemp;
    },
    mounted: function () {
        this.$nextTick(function () {
            var countUp = new CountUp('score', this.request.rat * 1);
            countUp.start();
        });
    }
});
