var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'statusbarHeight': 20,
        'request': {
            'cId': APP.GLOBAL.queryString('cId'),
            'name': APP.GLOBAL.queryString('name')
        },
        'pageModel': {
            'list': []
        },
        'activeNames': []
    },
    methods: {
        'gotoDetail': function (word, item, index) {
            APP.GLOBAL.gotoNewWindow('word.explain', {
                'paramObject': {
                    'word': word,
                    'courseName': this.request.name,
                    'chapterName': item.Key,
                    'list': item.Values,
                    'index': index
                }
            });
        },
        'gotoChapter': function (item) {
            APP.GLOBAL.gotoNewWindow('chapter.words', {
                'param': 'cId=' + item.Id + '&name=' + encodeURIComponent(item.Name)
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'TermCourseChapterWordList',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.list = JSON.parse(result.Data);
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
