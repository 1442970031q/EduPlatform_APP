var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'score': APP.GLOBAL.queryString('score') * 1,
            'qCount': APP.GLOBAL.queryString('qCount') * 1,
            'rCount': APP.GLOBAL.queryString('rCount') * 1
        },
        'errorList':[],
        'statusbarHeight': 20
    },
    methods: {
        'scoreAnimation': function () {
            this.$nextTick(function () {
                var countUp = new CountUp('score', this.request.score);
                countUp.start(_vue.animationComplete);
            });
        },
        'animationComplete': function () {
            
        },
        'gotoErrorList': function () {
            APP.GLOBAL.gotoNewWindow('word.error.list', {
                'paramObject': this.errorList
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
            this.errorList = plus.webview.currentWebview().paramObject;
        }
    },
    mounted: function () {
        this.scoreAnimation();
    }
});
