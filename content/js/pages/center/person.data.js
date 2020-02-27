Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default/default_avatar.jpg',
    'error': '../../content/img/default/default_avatar.jpg',
    'attempt': 1
});
var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isActionsheet': false,
        'actions': [{
            'name': '拍照选取',
            'callback': null
        }, {
            'name': '从相册选取',
            'callback': null
        }],
        'learn': {
            'group': false,
            'dorm': false
        },
        'statusbarHeight': 20,
    },
    methods: {
        'updatePage': function () {
            Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
        },
        'openCamera': function () {
            this.isActionsheet = false;
            var camera = plus.camera.getCamera();
            camera.captureImage(this.resolveFile);
        },
        'openGallery': function () {
            this.isActionsheet = false;
            plus.gallery.pick(this.resolveFile);
        },
        'resolveFile': function (captureFile) {
            APP.GLOBAL.toastLoading('正在加载');

            plus.io.resolveLocalFileSystemURL(captureFile, function (entry) {
                var fileName = APP.CONFIG.SYSTEM_NAME === 'ios' ? entry.toRemoteURL() : entry.toLocalURL();

                APP.GLOBAL.gotoNewWindow('croppa', {
                    ani: 'slide-in-bottom',
                    param: 'fn=' + encodeURIComponent(fileName),
                    openCallback: function () {
                        plus.navigator.setStatusBarStyle('light');
                        APP.GLOBAL.closeToastLoading();
                    },
                    closeCallback: function () {
                        plus.navigator.setStatusBarStyle('dark');
                    }
                });
            });
        },
        'loadingIsBeginLearn': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'IsCanOpenOrCloseGroupStudy',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (_vue.currentUser.IsGroupLeader) {
                        _vue.learn.group = result.IsCan;
                    } else if (_vue.currentUser.IsDormitoryLeader) {
                        _vue.learn.dorm = result.IsCan;
                    }
                }
            });
        },
        'change': function (type) {
            if (type === 1) {
                if (this.learn.group) {
                    this.learn.dorm = false;
                    this.GroupStartStudy();
                } else {
                    this.GroupEndStudy();
                }
                return
            }
            if (type === 2) {
                if (this.learn.dorm) {
                    this.learn.group = false;
                    this.DormStartStudy();
                } else {
                    this.DormEndStudy();
                }
                return
            }
        },
        'GroupStartStudy': function () {
            APP.GLOBAL.toastLoading({
                'message': '正在开启小组学习'
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GroupStartStudy',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        _vue.learn.group = false;
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': '开启小组学习',
                        'duration': 700
                    });
                }
            });
        },
        'GroupEndStudy': function () {
            APP.GLOBAL.toastLoading({
                'message': '正在关闭小组学习'
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GroupEndStudy',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': '关闭小组学习',
                        'duration': 700
                    });
                }
            });
        },
        'DormStartStudy': function () {
            APP.GLOBAL.toastLoading({
                'message': '正在开启宿舍学习'
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'DormStartStudy',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        _vue.learn.dorm = false;
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': '开启宿舍学习',
                        'duration': 700
                    });
                }
            });
        },
        'DormEndStudy': function () {
            APP.GLOBAL.toastLoading({
                'message': '正在关闭宿舍学习'
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'DormEndStudy',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': '关闭宿舍学习',
                        'duration': 700
                    });
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.loadingIsBeginLearn();
        this.actions[0].callback = this.openCamera;
        this.actions[1].callback = this.openGallery;
    }
});
