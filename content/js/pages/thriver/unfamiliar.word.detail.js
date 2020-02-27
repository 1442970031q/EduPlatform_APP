var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoadSound': true,
        'isPlaying': false,
        'statusbarHeight': 20,
        'pageModel': {
            'word': null
        },
        'player': null
    },
    methods: {
        'playSound': function () {
            if (!this.isPlaying) {
                this.isPlaying = true;

                if (APP.CONFIG.IS_RUNTIME) {
                    this.player.play();
                }
            }
        },
        'removeBook': function () {
            APP.GLOBAL.confirmMsg({
                'title': '移除确认',
                'message': '确定要将该单词从生词本中移除吗？',
                'confirmCallback': this.doRemoveBookAjax
            });
        },
        'doRemoveBookAjax': function () {
            APP.GLOBAL.toastLoading('正在移除');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RemoveNewWords',
                data: {
                    'gId': this.pageModel.word.Id
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (APP.CONFIG.IS_RUNTIME) {
                        var wb = plus.webview.getWebviewById('unfamiliar.wordPage');
                        wb.evalJS('_vue.loadPageData()');
                    }

                    APP.GLOBAL.toastMsg('已从生词本中移除');
                    APP.GLOBAL.closeWindow();
                }
            });
        },
        'canplay': function () {
            this.isLoadSound = false;
        },
        'ended': function () {
            this.isPlaying = false;
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            var wb = plus.webview.currentWebview();
            this.pageModel.word = wb.paramObject.word;

            this.player = plus.audio.createPlayer({
                'src': 'http://dict.youdao.com/dictvoice?audio=' + this.pageModel.word.Eng + '&type=2'
            });
            this.player.addEventListener('canplay', this.canplay);
            this.player.addEventListener('ended', this.ended);
        }
    }
});
