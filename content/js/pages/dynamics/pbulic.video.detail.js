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
        'vId': APP.GLOBAL.queryString('Id'),
        'posterImage': APP.GLOBAL.queryString('img'),
        'pageModel': {
            'infoData': {},
            'commentList': []
        },
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'pvId': ''
        },
        'repaly': {
            'pvId': APP.GLOBAL.queryString('Id'),
            'content': ''
        },
        'isLoading': true,
        'isLoadingComment': true,
        'isLoadMore': false,
        'isLoadComplete': false,
        'video': null
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicVideoDetail',
                data: {
                    pvId: this.vId
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue.pageModel, 'infoData', result.Data);
                    Vue.set(_vue.pageModel, 'IsCanComment', result.IsCanComment);
                    _vue.isLoading = false;
                    _vue.loadCommentListData();
                    setTimeout(_vue.createVideo, 350);
                }
            });
        },
        'createVideo': function () {
            this.video = new plus.video.VideoPlayer('video', {
                src: this.pageModel.infoData.FileSrc,
                position: 'absolute',
                autoplay: false,
                poster: this.pageModel.infoData.posterImage,
                width: '100%',
                height: '230px',
                top: this.statusbarHeight + 45 + 'px'
            });
            plus.webview.currentWebview().append(this.video);
        },
        'isLikeVideo': function (islike) {
            APP.GLOBAL.toastLoading(islike ? '正在点赞' : '正在取消');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'LikePublicVideo',
                data: {
                    pvId: this.vId,
                    isLike: islike
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.infoData.IsLike = islike;
                    if (islike) {
                        _vue.pageModel.infoData.LikeCount++;
                    } else {
                        _vue.pageModel.infoData.LikeCount--;
                    }
                }
            });
        },
        'getSize': function (size) {
            if (size < 1024) {
                return numberFormat(1024, 1) + 'KB';
            } else {
                return numberFormat(size / 1024, 1) + 'MB';
            }
        },
        'loadCommentListData': function () {
            this.form.pvId = this.vId;
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicVideoCommentList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue.pageModel, 'commentList', JSON.parse(result.JsonStr));
                    _vue.isLoadingComment = false;
                }
            });
        },
        'replayConmmentAjax': function () {
            if (!this.repaly.content) {
                APP.GLOBAL.toastMsg('请输入评论内容');
                return;
            }

            APP.GLOBAL.toastLoading('正在回复');
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CommentPublicVideo',
                data: this.repaly,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.updateDataLoca();
                }
            });
        },
        'updateDataLoca': function () {
            var obj = {
                "Commenter": this.currentUser.RealName,
                "CommenterAvatar": this.currentUser.Avatar,
                "CommentContent": this.repaly.content,
                "CommentTime": "就在刚刚"
            };

            this.pageModel.commentList.push(obj);
            this.repaly.content = '';
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicVideoCommentList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var list = JSON.parse(result.JsonStr);
                    _vue.pageModel.commentList = _vue.pageModel.commentList.concat(list);
                    _vue.isLoadMore = false;

                    if (list.length < _vue.form.pageSize) {
                        _vue.isLoadComplete = true;
                    }
                }
            });
        },
        'scrollBottom': function () {
            if (!this.isLoadMore && !this.isLoadComplete) {
                this.isLoadMore = true;
                this.form.pageIndex++;
                this.loadMore();
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
            window.onPageClose = function () {
                if (_vue.video !== null) {
                    _vue.video.close();
                }
                
                plus.webview.currentWebview().close();
            };
        }
    },
    mounted: function () {
        this.loadingPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
