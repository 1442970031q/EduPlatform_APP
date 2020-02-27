Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default/default_avatar.jpg',
    'error': '../../content/img/default/default_avatar.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'isLoading': true,
        'request': {
            'wId': APP.GLOBAL.queryString('wId')
        },
        'pageModel': {},
        'repaly': {
            'wId': APP.GLOBAL.queryString('wId'),
            'wcId': '',
            'content': ''
        },
        'scrollTop': 0
    },
    methods: {
        'checkReplay': function () {
            if (!this.repaly.content) {
                APP.GLOBAL.toastMsg('请输入内容');
            } else {
                this.doReplayConmmentAjax();
            }
        },
        'doReplayConmmentAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CommentWeekly',
                data: this.repaly,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.CommentCount++;
                    _vue.repaly.content = '';
                    _vue.$toast.success('评论成功');
                }
            });
        },
        'gotoMessage': function () {
            APP.GLOBAL.gotoNewWindow('comment.list', {
                param: 'cid=' + this.request.wId + '&isCanComment=' + this.pageModel.IsCanComment
            });
        },
        'doLikeAjax': function () {
            APP.GLOBAL.toastLoading(!this.pageModel.IsLike ? '正在点赞' : '正在取消');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'LikeWeekly',
                data: {
                    'wId': this.request.wId,
                    'isLike': !this.pageModel.IsLike
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (APP.CONFIG.IS_RUNTIME) {
                        var wbDy = plus.webview.getWebviewById('dynamics.htmlPage');
                        if (wbDy !== null) {
                            wbDy.evalJS('_vue.loadPageRecommendData()');
                        }

                        var wbGW = plus.webview.getWebviewById('good.weeklyPage');
                        if (wbGW !== null) {
                            wbGW.evalJS('_vue.loadPageData()');
                        }
                    }

                    if (!_vue.pageModel.IsLike) {
                        _vue.pageModel.LikeCount++;
                    } else {
                        _vue.pageModel.LikeCount--;
                    }

                    _vue.pageModel.IsLike = !_vue.pageModel.IsLike;
                }
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RecommendWeeklyDetail',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModel', result.Data);
                    Vue.set(_vue.pageModel, 'IsCanComment', result.IsCanComment);
                    Vue.set(_vue.pageModel, 'IsShowComment', result.IsShowComment);
                    _vue.isLoading = false;
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        window.scrollChange = function (top) {
            _vue.scrollTop = top;
        };
    },
    mounted: function () {
        this.loadPageData();
    }
});
