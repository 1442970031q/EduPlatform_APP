Vue.use(vant.Lazyload, {
    'loading': '../../content/img/thriver/default_video_detail.jpg',
    'error': '../../content/img/thriver/default_video_detail.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoadTag': true,
        'isLoadClasses': true,
        'statusbarHeight': 20,
        'type': [],
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 20,
            'isLoadMore': false,
            'isLoadComplete': false,
            'list': [],
            'tags': []
        },
        'selectedIndex': -1,
        'selectedTag': ''
    },
    methods: {
        'selectTag': function (index, tag) {
            this.selectedIndex = index;
            this.selectedTag = index === -1 ? '' : tag;

            this.isLoadClasses = true;
            this.pageModel.pageIndex = 1;
            this.loadPageData();
        },
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('video.detail', {
                'param': 'ty=3' + '&id=' + item.Id,
                'paramObject': item
            });
        },
        'loadTagData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RecommendCourseTagsList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.tags = result.Data;
                    _vue.isLoadTag = false;
                }
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RecommendCourseList',
                data: {
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize,
                    'tag': this.selectedTag
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data;
                    _vue.isLoadClasses = false;
                }
            });
        },
        'loadMoreAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RecommendCourseList',
                data: {
                    'pageIndex': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize,
                    'tag': this.selectedTag
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = _vue.pageModel.list.concat(result.Data);
                    _vue.pageModel.isLoadMore = false;

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
        window.scrollBottom = this.scrollBottom;

        this.loadTagData();
        this.loadPageData();
    }
});
