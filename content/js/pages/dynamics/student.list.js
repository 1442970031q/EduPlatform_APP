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
        'obj': JSON.parse(APP.GLOBAL.queryString('obj')),
        'isLoading': true,
        'data': '',
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'ty': '',
            'nm': ''
        },
        'isLoadMore': false,
        'isLoadComplete': false
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ExampleList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('student.info', {
                'paramObject': item
            });
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ExampleList',
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
        this.form.ty = this.obj.id;
    },
    mounted: function () {
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
