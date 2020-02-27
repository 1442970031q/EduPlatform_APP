var _vue = new Vue({
    el: '#bottom',
    data: {
        'bottom': [{
            'Id': 0,
            'Icon': '#icondongtaix',
            'selectIcon': '#icondongtaixuanzhongx',
            'name': '动态'
        }, {
            'Id': 1,
            'Icon': '#iconchengchangx',
            'selectIcon': '#iconchengchangxuanzhongzhuangtaix',
            'name': '成长'
        }, {
            'Id': 2,
            'Icon': '#iconjiuyex',
            'selectIcon': '#iconjiuyexuanzhongzhuangtaix',
            'name': '就业'
        }, {
            'Id': 3,
            'Icon': '#iconwodex',
            'selectIcon': '#iconwodexuanzhongzhuangtaix',
            'name': '我的'
        }],
        'currentIndex': 0,
        'runtimeMainActivity': null
    },
    methods: {
        'setWebviewMask': function (isVisible) {
            var self = plus.webview.currentWebview();
            self.setStyle({
                'mask': isVisible ? 'rgba(0,0,0,.8)' : 'none'
            });
        },
        'read': function () {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                this.getActivity();
            }

            var isSafeArea = APP.CONFIG.IPHONE.isIPhoneX || APP.CONFIG.IPHONE.isIPhoneXR || APP.CONFIG.IPHONE.isIPhoneXSMax;
            if (isSafeArea) {
                document.getElementById('bottom').style.paddingBottom = '30px';
            }

            var self = plus.webview.currentWebview();

            for (var i = APP.CONFIG.SUB_PAGES.length - 1; i >= 0; i--) {
                //创建webview子页
                var sub = plus.webview.create(
                    APP.CONFIG.SUB_PAGES[i].pageName, //子页url
                    APP.CONFIG.SUB_PAGES[i].pageName + 'Page', {
                        top: '0px', //设置距离顶部的距离
                        bottom: isSafeArea ? '85px' : '55px', //设置距离底部的距离
                        zindex: 1,
                        scrollIndicator: 'none',
                        scalable: false,
                        kernel: 'WKWebview',
                        contentAjust: false
                    }
                );

                //将webview对象填充到窗口
                self.append(sub);
            }

            this.checkUpgrade();
        },
        'openUpgradeWindow': function (result) {
            var windowSize = {
                'width': 300,
                'height': 470
            };

            var screenObj = plus.screen;
            var screenWidth = screenObj.resolutionWidth;
            var screenHeight = screenObj.resolutionHeight;

            var upgradPage = plus.webview.create(
                'upgrade.html',
                'upgradePage', {
                    top: (screenHeight - windowSize.height) / 2,
                    left: (screenWidth - windowSize.width) / 2,
                    zindex: 1,
                    scrollIndicator: 'none',
                    scalable: false,
                    kernel: 'WKWebview',
                    contentAjust: false,
                    popGesture: 'none',
                    background: 'transparent',
                    width: windowSize.width,
                    height: windowSize.height
                }, {
                    'objectParams': result
                }
            );

            upgradPage.addEventListener('loaded', function () {
                var webView = plus.webview.currentWebview();
                webView.setStyle({ mask: 'rgba(0,0,0,0.8)' });

                upgradPage.show('zoom-fade-out', 300);
            });
        },
        'checkUpgrade': function (isCheckonly) {
            if (this.isChecking) return;

            this.isChecking = true;
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CheckVersion',
                data: {
                    'ver': APP.CONFIG.VERSION
                },
                success: function (result) {
                    _vue.isChecking = false;
                    if (result.Error) return;

                    if (result.IsUpgrade) {
                        if (typeof isCheckonly === 'boolean') {
                            plus.webview.getWebviewById('settingPage').evalJS('_vue.checkCallback(true, "' + result.BaseUrl + '", "' + result.Version + '")');
                        } else {
                            _vue.openUpgradeWindow(result);
                        }
                    } else {
                        if (typeof isCheckonly === 'boolean') {
                            plus.webview.getWebviewById('settingPage').evalJS('_vue.checkCallback(false, "' + result.BaseUrl + '", "' + result.Version + '")');
                        }
                    }
                }
            });
        },
        'switchPage': function (item) {
            if (this.currentIndex === item.Id) return;

            var nextPage = APP.CONFIG.SUB_PAGES[item.Id];
            this.currentIndex = item.Id;
            if (APP.CONFIG.IS_RUNTIME) {
                plus.webview.getWebviewById(nextPage.pageName + 'Page').show();
            }
        },
        'setClipBoard': function (text) {
            if (APP.CONFIG.SYSTEM_NAME === 'ios') {
                var UIPasteboard = plus.ios.importClass("UIPasteboard");
                var generalPasteboard = UIPasteboard.generalPasteboard();
                generalPasteboard.setValueforPasteboardType(text, "public.utf8-plain-text");
            } else {
                var Context = plus.android.importClass("android.content.Context");
                var activity = this.getActivity();
                var clip = activity.getSystemService(Context.CLIPBOARD_SERVICE);
                plus.android.invoke(clip, "setText", text);
            }
        },
        'hiddenApp': function () {
            if (APP.CONFIG.SYSTEM_NAME !== 'ios') {
                var activity = this.getActivity();
                activity.moveTaskToBack(false);
            }
        },
        'getActivity': function () {
            if (this.runtimeMainActivity === null) {
                this.runtimeMainActivity = plus.android.runtimeMainActivity();
            }

            return this.runtimeMainActivity;
        }
    },
    computed: {
        'screenHeight': function () {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                return plus.display.resolutionHeight;
            } else {
                return document.body.clientHeight;
            }
        }
    },
    created: function () {
        this.read();
    }
});

//当APP重新激活时检查是否需要更新
document.addEventListener('resume', function () { _vue.checkUpgrade(); });