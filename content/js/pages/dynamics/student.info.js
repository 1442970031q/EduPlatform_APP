Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default/default_avatar.jpg',
    'error':'../../content/img/default/default_avatar.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'item': {}
    },
    methods: {},
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            Vue.set(this, 'item', wb.paramObject);
        }
    }
});
