Vue.use(vant.Lazyload, {
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isLoadEmoticon': true,
        'request': {
            'pbId': APP.GLOBAL.queryString('qId')
        },
        'emoticons': [],
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'isLoadMore': false,
            'isLoadComplete': false
        },
        'statusbarHeight': 20
    },
    methods: {
        'filterQuestion': function (content) {
            if (!content) return '';

            var noImgTag = content.replace(/<img\b[^>]*>/g, '');
            for (var i = 0; i < this.emoticons.length; i++) {
                var patt = new RegExp('\\[' + this.emoticons[i].name + '\\]', 'g');
                if (patt.test(noImgTag)) {
                    noImgTag = noImgTag.replace(patt, '<img class="small_emoticon" src="' + this.emoticons[i].src + '"/>');
                }
            }
            return noImgTag;
        },
        'getQuestionImages': function (question) {
            var images = question.toString().match(/<img.*?(?:>|\/>)/gi);
            if (images === null) return [];

            return images;
        },
        'focusQuestion': function () {
            APP.GLOBAL.toastLoading('正在操作');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardAttention',
                data: {
                    'pbId': this.pageModel.Id,
                    'isAttention': !this.pageModel.IsAttention
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (_vue.pageModel.IsAttention) {
                        _vue.pageModel.AttentionCount -= 1;
                    } else {
                        _vue.pageModel.AttentionCount += 1;
                    }

                    _vue.$toast.success({
                        'message': _vue.pageModel.IsAttention ? '已取消' : '已关注',
                        'duration': 700
                    });
                    _vue.pageModel.IsAttention = !_vue.pageModel.IsAttention;
                }
            });
        },
        'gotoAnswer': function () {
            APP.GLOBAL.gotoNewWindow('question.answer', {
                'param': 'qId=' + this.pageModel.Id
            });
        },
        'filterImgTag': function (html) {
            var noImgTag = html.replace(/<img\b[^>]*>/g, '');
            for (var i = 0; i < this.emoticons.length; i++) {
                var patt = new RegExp('\\[' + this.emoticons[i].name + '\\]', 'g');
                if (patt.test(noImgTag)) {
                    noImgTag = noImgTag.replace(patt, '<img class="small_emoticon" src="' + this.emoticons[i].src + '"/>');
                }
            }
            return noImgTag;
        },
        'getImages': function (item) {
            var images = item.AnswerContent.toString().match(/<img.*?(?:>|\/>)/gi);
            if (images === null) return [];

            return images;
        },
        'getSrc': function (img) {
            var src = img.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
            return {
                'src': src,
                'loading': '../../content/img/thriver/question_default.jpg',
                'error': '../../content/img/thriver/question_default.jpg'
            };
        },
        'viewImage': function (img) {
            var src = img.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
            vant.ImagePreview({
                images: [{
                    'src': src,
                    'loading':'../../content/img/loading.svg',
                    'error':'../../content/img/thriver/default_image_preview.jpg'
                }],
                showIndex: false,
                lazyLoad: true
            });
        },
        'reloadData': function () {
            this.isLoading = true;
            this.pageModel.pageIndex = 1;
            this.$toast.success('已回答');

            this.loadPageData();
        },
        'loadEmoticonData': function () {
            plus.io.resolveLocalFileSystemURL('_www/content/img/emoticon', function (entry) {
                var reader = entry.createReader();
                reader.readEntries(function (entrys) {
                    for (var i = 0; i < entrys.length; i++) {
                        if (entrys[i].isFile) {
                            _vue.emoticons.push({
                                'src': '../../content/img/emoticon/' + entrys[i].name,
                                'name': entrys[i].name.substring(0, entrys[i].name.indexOf('.'))
                            });
                        }
                    }

                    _vue.isLoadEmoticon = false;
                });
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardDetail',
                data: {
                    'pbId': this.request.pbId,
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    result.Data.Avatar = {
                        'src': result.Data.Avatar,
                        'loading': '../../content/img/default/default_avatar.jpg',
                        'error': '../../content/img/default/default_avatar.jpg'
                    };

                    for (var i = 0; i < result.Data.CommentList.length; i++) {
                        result.Data.CommentList[i].Avatar = {
                            'src': result.Data.CommentList[i].Avatar,
                            'loading': '../../content/img/default/default_avatar.jpg',
                            'error': '../../content/img/default/default_avatar.jpg'
                        };
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel = Object.assign({}, _vue.pageModel, result.Data);
                    _vue.pageModel.IsCanComment = result.IsCanComment;
                    _vue.isLoading = false;
                }
            });
        },
        'loadMoreAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardAnswersList',
                data: {
                    'pbId': this.request.pbId,
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.isLoadMore = false;
                    _vue.pageModel.CommentList = _vue.pageModel.CommentList.concat(result.Data);
                    _vue.pageModel.pageIndex++;
                    if (result.Data.length < _vue.pageModel.pageSize) {
                        _vue.pageModel.isLoadComplete = true;
                    }
                }
            });
        },
        'scrollBottom': function () {
            if (!this.pageModel.isLoadMore && !this.pageModel.isLoadComplete) {
                this.pageModel.isLoadMore = true;
                this.loadMoreAjax();
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.loadEmoticonData();
        } else {
            this.isLoadEmoticon = false;
        }

        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
