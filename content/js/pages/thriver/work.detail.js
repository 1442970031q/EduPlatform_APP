Vue.use(vant.Lazyload, {
    'loading': '../../content/img/thriver/question_default.jpg',
    'error': '../../content/img/thriver/question_default.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'request': {
            'id': APP.GLOBAL.queryString('id')
        },
        'pageModel': {},
        'statusbarHeight': 20
    },
    methods: {
        'viewImage': function (item) {
            vant.ImagePreview({
                images: [{
                    'src': item.ImageSrc,
                    'loading': '../../content/img/loading.svg',
                    'error': '../../content/img/thriver/default_image_preview.jpg'
                }],
                showIndex: false,
                lazyLoad: true
            });
        },
        'lodaPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'HomeworkDetail',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModel', result.Data);
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
        this.lodaPageData();
    }
});

