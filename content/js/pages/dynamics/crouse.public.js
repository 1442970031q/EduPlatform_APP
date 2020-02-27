Vue.use(vant.Lazyload, {
    'loading': '../../content/img/conversion/default_conversion_block.jpg',
    'error': '../../content/img/conversion/default_conversion_block.jpg',
    'attempt': 1
});
var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'checked': true,
        'tags': '',
        'data': '',
        'isCheck': 0,
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'tag': ''
        },
        'isLoading': true,
        'isLoadingContent': true,
        'isLoadMore': false,
        'isLoadComplete': false,
        'tagHeight': 0
    },
    computed: {
        'tagSum': function () {
            var s = 0;
            for (var i = 0; i < this.tags.length; i++) {
                s += this.tags[i].Num;
            }
            return s;
        }
    },
    methods: {
        'loadingTagList': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicCourseTagsList',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.tags = result.Data;
                    _vue.isLoading = false;

                    _vue.searchTagData();
                }
            });
        },
        'searchTagData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicCourseList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data = result.Data;
                    _vue.isLoadingContent = false;
                }
            });
        },
        'switchTags': function (id, tag) {
            this.form.tag = tag;
            this.isCheck = id;
            this.form.pageIndex = 1;
            this.isLoadComplete = false;
            this.isLoadingContent = true;

            this.searchTagData();
        },
        'gotoDeatil': function (item) {
            APP.GLOBAL.gotoNewWindow('public.crouse.detail', {
                'paramObject': item
            });
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicCourseList',
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
        }
    },
    mounted: function () {
        this.loadingTagList();
        window.scrollBottom = this.scrollBottom;
    }
});
