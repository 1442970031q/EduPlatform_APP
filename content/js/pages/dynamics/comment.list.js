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
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'wId': APP.GLOBAL.queryString('cid')
        },
        'focusState': false,
        'data': '',
        'isLoading': true,
        'repaly': {
            'content': '',
            'wcId': '',
            'wId': APP.GLOBAL.queryString('cid')
        },
        'replayinfo': '在此处输入您的评论',
        'url': {
            'load': '',
            'comment': '',
            'like': ''
        },
        'isLoadMore': false,
        'isLoadComplete': false,
        'checkReplayIndex': '',
        'isCanComment': APP.GLOBAL.queryString('isCanComment')
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyCommentList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'data', JSON.parse(result.JsonStr))
                    _vue.isLoading = false;
                }
            });
        },
        'isLike': function (id, isike, index) {
            if (isike) {
                APP.GLOBAL.toastLoading({
                    'message': '正在点赞'
                })
            } else {
                APP.GLOBAL.toastLoading({
                    'message': '正在取消'
                })
            }

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'LikeWeeklyComment',
                data: {
                    'wcId': id,
                    'isLike': isike
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data[index].IsLike = isike;
                    if (isike != 'False') {
                        _vue.data[index].LikeCount++;
                    } else {
                        _vue.data[index].LikeCount--;
                    }
                }
            });
        },
        'focusclick': function (item, index) {
            this.replayinfo = '回复：' + item.Commenter;
            this.focusState = true;
            this.repaly.wcId = item.Id;
            this.checkReplayIndex = index;
        },
        'replayConmmentAjax': function () {
            if (!this.repaly.content) {
                APP.GLOBAL.toastMsg('请输入内容');
                return;
            }
            APP.GLOBAL.toastLoading({
                'message': '正在回复'
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CommentWeekly',
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
        'gotoDetail': function (item, num) {
            var obj = JSON.parse(JSON.stringify(item));
            delete obj.SonList;
            obj.number = num;
            var wid = APP.GLOBAL.queryString('cid');
            var pvid = APP.GLOBAL.queryString('pvid');
            if (wid != '') {
                obj.wId = this.form.wId;
            }
            if (pvid != '') {
                obj.pvId = this.form.pvId;
            }

            APP.GLOBAL.gotoNewWindow('comment.detail', {
                param: 'isCanComment='+this.isCanComment,
                paramObject: obj
            });

        },
        'updateDataLoca': function () {
            if (this.checkReplayIndex === '') {
                var obj = {
                    "Id": this.currentUser.Id,
                    "Commenter": this.currentUser.RealName,
                    "CommenterAvatar": this.currentUser.CommenterAvatar,
                    "CommentContent": this.repaly.content,
                    "CommentTime": new Date().getMonth() + 1 + '月' + new Date().getDay() + 1 + '日',
                    "LikeCount": 0,
                    "IsLike": "False",
                    "SonCount": 0,
                    "SonList": []
                }
                this.data.push(obj);
                this.$toast.success('评论成功');
            } else {
                var son = {
                    "Id": this.currentUser.Id,
                    "Commenter": this.currentUser.RealName,
                    "CommenterAvatar": this.currentUser.Avatar,
                    "Respondent": this.data[this.checkReplayIndex].Commenter,
                    "RespondentAvatar": this.data[this.checkReplayIndex].CommenterAvatar,
                    "CommentContent": this.repaly.content,
                    "CommentTime": new Date().getMonth() + 1 + '月' + new Date().getDay() + 1 + '日',
                    "LikeCount": 0,
                    "IsLike": "False"
                }
                this.data[this.checkReplayIndex].SonList.push(son);
            }

            this.$toast.success('评论成功');
            this.repaly.content = '';
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyCommentList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var d = _vue.data.concat(JSON.parse(result.JsonStr));
                    Vue.set(_vue, 'data', d);
                    _vue.isLoadMore = false;

                    if (JSON.parse(result.JsonStr).length < _vue.form.pageSize) {
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
        };
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    },
    directives: {
        focus: {
            //根据focusState的状态改变是否聚焦focus
            'update': function (el, {
                value
            }) { //第二个参数传进来的是个json
                if (value) {
                    el.focus();
                }
            }
        }
    }
});
