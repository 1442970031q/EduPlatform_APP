var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'checked': true,
        'fileTotalSize': 0,
        'pathList': ['_downloads/', '_doc/update/']
    },
    methods: {
        'checkUpgrade': function () {
            APP.GLOBAL.toastLoading('正在检查');

            if (APP.CONFIG.IS_RUNTIME) {
                var wb = plus.webview.getWebviewById('mainPage');
                wb.evalJS('_vue.checkUpgrade(true)');
            } else {
                APP.GLOBAL.closeToastLoading();
            }
        },
        'checkCallback': function (isUpgrade, baseUrl, ver) {
            APP.GLOBAL.closeToastLoading();

            if (!isUpgrade) {
                this.$toast.success({
                    'message': '已是最新版本',
                    'duration': 500
                });
            } else {
                this.$dialog.confirm({
                    'title': '有更新',
                    'message': '发现了新版本，是否要现在升级？'
                }).then(function () {
                    var wb = plus.webview.getWebviewById('mainPage');
                    wb.evalJS('_vue.downloadWGT("' + baseUrl + '", "' + ver + '")');
                });
            }
        },
        'loginOut': function () {
            APP.GLOBAL.confirmMsg({
                'title': '退出登录',
                'message': '确定要注销当前登录的账号吗？',
                'confirmCallback': this.loginOutAjax
            });
        },
        'loginOutAjax': function () {
            APP.GLOBAL.toastLoading('正在注销');
			
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'Logout',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg); 
                        return;
                    }

                    APP.GLOBAL.removeModel();
                    APP.GLOBAL.gotoNewWindow('../account/login', {
                        'openCallback': function () {
                            var mainPage = plus.webview.getWebviewById('mainPage');
                            if (mainPage !== null) {
                                mainPage.close('none');
                            }
                            
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'cofirmClear': function () {
            if (this.fileTotalSize <= 0) {
                APP.GLOBAL.toastMsg('暂无使用');
                return;
            }

            APP.GLOBAL.confirmMsg({
                'title': '清理缓存',
                'message': '确定要清理手机缓存吗？',
                'confirmCallback': this.clearCache
            });
        },
        'clearCache': function () {
            APP.GLOBAL.toastLoading('正在清理');
            this.loadLocalFiles(true);
        },
        'loadLocalFiles': function (isRemove) {
            for (var i = 0; i < this.pathList.length; i++) {
                plus.io.resolveLocalFileSystemURL(this.pathList[i], function (entry) {
                    var reader = entry.createReader();
                    reader.readEntries(function (entrys) {
                        _vue.entrysList(entrys, isRemove);
                    });
                });
            }
        },
        'entrysList': function (entrys, isRemove) {
            for (var i = 0; i < entrys.length; i++) {
                if (entrys[i].isFile) {
                    if (isRemove) {
                        entrys[i].remove();
                    } else {
                        entrys[i].getMetadata(function (meta) {
                            _vue.fileTotalSize += meta.size;
                        });
                    }
                }
            }

            if (isRemove) {
                this.fileTotalSize = 0;
                APP.GLOBAL.closeToastLoading();
            }
        }
    },
    computed: {
        'fileSize': function () {
            if (this.fileTotalSize === 0) {
                return '未使用';
            } else if (this.fileTotalSize < 1024) {
                return numberFormat(this.fileTotalSize, 2) + 'B';
            } else if (this.fileTotalSize > 1024 && this.fileTotalSize < Math.pow(1024, 2)) {
                return numberFormat(this.fileTotalSize / 1024, 2) + 'KB';
            } else if (this.fileTotalSize > Math.pow(1024, 2)) {
                return numberFormat(this.fileTotalSize / Math.pow(1024, 2), 2) + 'MB';
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
            this.loadLocalFiles(false);
        }
    }
});
