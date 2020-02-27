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
        'request': {
            'id': APP.GLOBAL.queryString('id'),
            'ty': APP.GLOBAL.queryString('ty'),
            'frm': APP.GLOBAL.queryString('frm')
        },
        'activeNames': [],
        'pageModel': {
            'Id': 0,
            'Name': '',
            'Introduce': '',
            'ImageSrc': {},
            'IsBuy': false,
            'Price': 0,
            'BuyCount': 0,
            'Speed': 0,
            'chapterList': []
        },
        'statusbarHeight': 20,
        'player': null,
        'selectedItem': null
    },
    methods: {
        'openReource': function (item, r) {
            if (r.ResType !== 1) {
                APP.GLOBAL.toastMsg('暂不支持该类型资源');
                return;
            }

            this.selectedItem = { 'chapter': item, 'resource': r };
			console.log(r.IsLooked);
            if (this.player === null) {
                this.player = new plus.video.VideoPlayer('video', {
                    'src': r.FileSrc,
                    'position': 'absolute',
                    'autoplay': false,
                    'show-progress':false,
                    'enable-progress-gesture': false,
                    'width': '100%',
                    'top': this.statusbarHeight + 45 + 'px',
                    'height': '230px'
                });
                this.player.addEventListener('ended', this.videoComplete);
                plus.webview.currentWebview().append(this.player);
            } else {
                this.player.setStyles({
                    'src': r.FileSrc,
                    'show-progress': false,
                    'enable-progress-gesture':false
                });
            }
	 
        },
        'videoComplete': function () {
            if (this.selectedItem.resource.IsLooked) return;

            var postData = {
                'cId': this.request.id,
                'cpId': this.selectedItem.chapter.Id,
                'rId': this.selectedItem.resource.Id,
                'ty': this.request.ty
            };

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'UpdateCourseProgress',
                data: postData,
                success: function (result) {
                    if (!result.Error) {
                        _vue.selectedItem.resource.IsLooked = true;
                        _vue.pageModel.Speed = result.ProgressBar;

                        if (APP.CONFIG.IS_RUNTIME) {
                            plus.nativeUI.toast('您的学习进度更新了', {
                                'icon': '../../content/img/thriver/icon_update.png',
                                'iconWidth': '64px',
                                'iconHeight': '64px',
                                'verticalAlign': 'center'
                            });

                            var pageName = _vue.request.frm === 'video' ? 'thriver.htmlPage' : 'my.crousePage';
                            var wb = plus.webview.getWebviewById(pageName);
                            if (_vue.request.frm === 'video') {
                                wb.evalJS('_vue.loadCurrentTabData()');
                            } else {
                                wb.evalJS('_vue.loadPageData()');
                            }
                        }
                    }
                }
            });
        },
        'getSize': function (size) {
            if (size <= 0) {
                return '未知的';
            } else if (size <= 1024) {
                return numberFormat(size, 1) + 'KB';
            } else {
                return numberFormat(size / 1024, 1) + 'MB';
            }
        },
        'padLeft': function (num) {
            var n = num.toString();
            if (n.length < 2) {
                return '0' + n;
            } else {
                return n;
            }
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CourseChapterList',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < result.Data.length; i++) {
                        _vue.activeNames.push(i + 1);
                    }
                    _vue.pageModel.chapterList = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'gotoBuyVoid': function () {
            if (this.currentUser.YSDCoin < this.pageModel.Price) {
                _vue.$toast({
                    'message': '无法兑换！\n您的云币数量不足',
                    'icon': '../../content/img/conversion/product_detail_bg.png'
                });
                return;
            }
            APP.GLOBAL.confirmMsg({
                'title': '购买确认',
                'message': '<p>你将花费 ' + numberFormat(this.pageModel.Price, 2) + ' 云币</p><p>是否购买该产品？</p>',
                'confirmCallback': this.gotoBuyVoidAjax,
                'confirmButtonText': '确认购买',
                'cancelButtonText': '取消'
            });
        },
        'gotoBuyVoidAjax': function () {
            APP.GLOBAL.toastLoading('正在购买');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'BuyRecommendCourse',
                data: {
                    'id': this.pageModel.Id
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        _vue.$toast({
                            'message': result.Msg,
                            'icon': '../../content/img/conversion/product_detail_bg.png'
                        });
                        return;
                    }

                    if (_vue.pageModel.Price!==0) {
                        APP.GLOBAL.updateUserModel({
                            'YSDCoin': result.YCoin
                        }, [{
                            'pageName': 'center.htmlPage',
                            'actionName': '_vue.updatePage()'
                        }]);
                    }
         
                    APP.GLOBAL.gotoNewWindow('buy.success', {
                        'closeCallback': function () {
                            var wb = plus.webview.getWebviewById('thriver.htmlPage');
                            wb.evalJS('_vue.loadTabDataByIndex(0)');
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            window.onPageClose = function () {
                if (_vue.player !== null) {
                    _vue.player.close();
                }
                plus.webview.currentWebview().close();
            };

            var item = plus.webview.currentWebview().paramObject;
            item.ImageSrc = {
                'src': typeof item.ImageSrc.src === 'undefined' ? item.ImageSrc : item.ImageSrc.src,
                'loading': '../../content/img/thriver/default_video_detail.jpg',
                'error': '../../content/img/thriver/default_video_detail.jpg'
            };
            Vue.set(this, 'pageModel', item);
        }
    },
    mounted: function () {
        this.loadPageData();
    }
});
