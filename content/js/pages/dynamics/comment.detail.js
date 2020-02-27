Vue.use(vant.Lazyload, {
    'loading': '../../content/img/center/list_head_bg.png',
    'error': '../../content/img/center/list_head_bg.png'
}, {
        'attempt': 1
    });

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'item': '',
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'wcId': ''
        },
        'focusState': false,
        'data': '',
        'isLoading': true,
        'repaly': {
            'content': '',
            'wcId': '',
            'wId': ''
        },
        'replayinfo': '回复评论',
        'isLoadMore': false,
        'isLoadComplete': false,
        'checkReplayIndex': '',
        'replayName': '',
        'isCanComment': APP.GLOBAL.queryString('isCanComment')
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyCommentSonList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'data', result.Data);
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
                    'pvcId': id,
                    'isLike': isike
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data[index].IsLike = isike;
                    if (isike) {
                        _vue.data[index].LikeCount++;
                    } else {
                        _vue.data[index].LikeCount--;
                    }
                }
            });
        },
        'focusclick': function (id, name, index) {
            this.replayinfo = '回复：' + name;
            this.replayName = name;
            this.focusState = true;
            this.repaly.wcId = id;
            this.checkReplayIndex = index;
        },
        'replayConmmentAjax': function () {
            if (!this.repaly.content) {
                APP.GLOBAL.toastMsg('请输入内容');
                return
            }

            APP.GLOBAL.toastLoading({
                'message': '正在回复'
            })

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
        'updateDataLoca': function () {
            var obj = {
                "Id": this.currentUser.Id,
                "Commenter": this.currentUser.RealName,
                "CommenterAvatar": this.currentUser.CommenterAvatar,
                "Respondent": '',
                "CommentContent": this.repaly.content,
                "CommentTime": new Date().getMonth() + 1 + '月' + new Date().getDay() + 1 + '日',
                "LikeCount": 0,
                "IsLike": false
            }
            if (this.checkReplayIndex === '') {
                obj.Respondent = this.item.Commenter;
            } else {
                obj.Respondent = this.replayName;
            }

            this.data.push(obj);
            this.$toast.success('评论成功');
            this.repaly.content = '';
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyCommentSonList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data = _vue.data.concat(result.Data);
                    _vue.isLoadMore = false;

                    if (result.Data.length < _vue.form.pageSize) {
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

            var wb = plus.webview.currentWebview();
            this.item = wb.paramObject;
            this.form.wcId = this.item.Id;
            this.repaly.wcId = this.item.Id;
            this.repaly.wId = this.item.wId;
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
                    el.focus()
                }
            }
        }
    }
});
