Vue.use(vant.Lazyload, {
    'loading': '../../content/img/thriver/default_video_detail.jpg',
    'error': '../../content/img/thriver/default_video_detail.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'statusbarHeight': 20,
        'pageModel': {
            'list': []
        }
    },
    methods: {
        'filterHtml': function (text) {
            if (!text) return text;

            return text.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, '').substring(0, 40);
        },
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('video.detail', {
                'param': 'ty=1' + '&id=' + item.Id + '&frm=list',
                'paramObject': item
            });
        },
        'loadPageData': function () {
            this.isLoading = true;
            this.pageModel.list = [];

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MyCourseList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    result.Data = result.Data.replace(/\n/g, '');
                    var obj = eval('(' + result.Data + ')');
                    _vue.pageModel.list = obj;

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
