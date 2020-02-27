
Vue.use(vant.Lazyload, { 'attempt': 1 });
var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'data': '',
        'form': {
            'pageIndex': 1,
            'pageSize': 15,
            'px': 1
        },
        'isLoading': true
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ObtainEmploymentVideoList',
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
            this.form.px = id;
            this.loadPageData();
        },
        'gotoDeatil': function (id) {
            APP.GLOBAL.gotoNewWindow('public.crouse.detail', {
                param: 'Id=' + id
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
        this.loadPageData();
    }
});