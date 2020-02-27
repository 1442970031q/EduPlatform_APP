Vue.use(vant.Lazyload, {
    'loading': '../../content/img/center/list_head_bg.png',
    'error': '../../content/img/center/list_head_bg.png',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': [],
        'isLoadMore': false,
        'isLoadComplete': false,
        'isLoading': true,
        'form': {
            'pageIndex': 1,
            'pageSize': 15
        }
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MyAttentionProblemBoard',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModule', result.Data);
                    _vue.isLoading = false;
                }
            });
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MyAttentionProblemBoard',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModule = _vue.pageModule.concat(result.Data);
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
        },
        'gotoQuestionDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('../thriver/question.detail', {
                'param': 'qId=' + item.Id
            });
        },
        'focusQuestion': function (item,index) {
            APP.GLOBAL.toastLoading('正在操作');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardAttention',
                data: {
                    'pbId': item.Id,
                    'isAttention': false
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					
					_vue.pageModule.splice(index,1);
                    _vue.$toast.success({
                        'message': '已取消',
                        'duration': 700
                    });
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadingPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
