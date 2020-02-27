var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'activeName': -1,
        'pageModel': {
            'count': 0,
            'classes': []
        },
        'statusbarHeight': 20
    },
    methods: {
        'clearCollection': function () {
            APP.GLOBAL.confirmMsg({
                'messageAlign': 'left',
                'title': '清空确认',
                'message': '确定要清空掉所有的错误题目记录吗？</br>注意：清空后无法恢复！',
                'confirmCallback': this.doClearErrorCollection
            });
        },
        'doClearErrorCollection': function () {
            APP.GLOBAL.toastLoading('正在清空');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ClearMistakesCollection',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success('清空完毕');
                    _vue.isLoading = true;
                    _vue.loadPageData();
                }
            });
        },
        'gotoResolve': function (chapter) {
            APP.GLOBAL.gotoNewWindow('error.resolve.by.collection', {
                'param': 'chapterIds=' + chapter.Id
            });
        },
        'getTotalCount': function (item) {
            var count = 0;
            for (var i = 0; i < item.ChapterList.length; i++) {
                count += item.ChapterList[i].ErrorCount;
            }

            return count;
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MistakesCollectionLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.count = result.TotalCount;
                    _vue.pageModel.classes = JSON.parse(result.JsonStr);
                    _vue.isLoading = false;
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
        this.loadPageData();
    }
});
