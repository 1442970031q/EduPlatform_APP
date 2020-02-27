Vue.use(vant.Lazyload, {
    'loading': '../../content/img/conversion/default_400_300.jpg',
    'error': '../../content/img/conversion/default_400_300.jpg',
    'attempt': 1
});
var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'data': [],
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'px': 1
        },
        'isLoading': true,
        'isLoadMore': false,
        'isLoadComplete': false
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicVideoList',
                data: this.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'switchTags': function (id) {
            this.isLoading = true;
            this.form.px = id;
            this.form.pageIndex = 1;

            this.loadPageData();
        },
        'gotoDeatil': function (item) {
            APP.GLOBAL.gotoNewWindow('public.video.detail', {
                param: 'Id=' + item.Id + '&img=' + encodeURIComponent(item.ImageSrc)
            });
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicVideoList',
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
        },
        'getSize': function (size) {
            if (size < 1024) {
                return numberFormat(size, 1) + 'KB';
            } else {
                return numberFormat(size / 1024, 1) + 'MB';
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
