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
        'request': {},
        'video': null,
        'pageModel': {
            'data': []
        },
        'isShowIndex': [0],
        'currentResource': null
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicCourseChapterList',
                data: {
                    id: this.request.Id
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.data = result.Data;
                    _vue.isLoading = false;

                    _vue.$nextTick(function () {
                        _vue.currentResource = _vue.getFirstVideoResource();
                        if (_vue.currentResource !== null) {
                            setTimeout(_vue.playVideo, 350);
                        }
                    });
                }
            });
        },
        'playVideo': function () {
            if (!APP.CONFIG.IS_RUNTIME) return;

            this.video = new plus.video.VideoPlayer('video', {
                src: this.currentResource.FileSrc,
                position: "absolute",
                autoplay: true,
                width: '100%',
                height: '230px',
                top: this.statusbarHeight + 45 + 'px'
            });
            plus.webview.currentWebview().append(this.video);
        },
        'getFirstVideoResource': function () {
            for (index in this.pageModel.data) {
                for (i in this.pageModel.data[index].ResourceList) {
                    if (this.pageModel.data[index].ResourceList[i].ResType === 1) {
                        return this.pageModel.data[index].ResourceList[i];
                    }
                }
            }

            return null;
        },
        'getResourceCount': function (type) {
            var count = 0;
            for (var i = 0; i < this.pageModel.data.length; i++) {
                if (type === 2) {
                    count += this.pageModel.data[i].ZLCount;
                } else if (type === 1) {
                    count += this.pageModel.data[i].VideoCount;
                }
            }

            return count;
        },
        'getSize': function (kb) {
            if (kb < 1024) return numberFormat(kb, 1) + 'KB';

            return numberFormat(kb / 1024, 1) + 'MB';
        },
        'changeVideo': function (item) {
            if (item.ResType === 2) {
                APP.GLOBAL.toastMsg('非视频文件');
                return;
            }

            if (item.FileSrc === this.currentResource.FileSrc) {
                APP.GLOBAL.toastMsg('正在播放当前课程');
                return;
            }

            this.currentResource = item;
            this.video.setStyles({
                'src': this.currentResource.FileSrc
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            Vue.set(this, 'request', wb.paramObject);
        }
    },
    mounted: function () {
        this.loadingPageData();
    }
});
