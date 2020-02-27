var _vue = new Vue({
    el: '#app',
    data: {
        'request': {
            'baseUrl':'',
            'version': '',
            'des':''
        },
        'pageModel': {
            'downloader': null,
            'isDownload': false,
            'isComplete': false,
            'downloadPer': 0
        }
    },
    methods: {
        'doDownload': function () {
            this.pageModel.isDownload = true;

            var fileName = this.request.version + '.wgt';
            var wgtUrl = this.request.baseUrl + fileName;
            this.pageModel.downloader = plus.downloader.createDownload(wgtUrl, {
                'filename': '_downloads/kb_' + fileName,
                'timeout': 12000
            }, this.downloadCompleted);

            this.pageModel.downloader.addEventListener('statechanged', this.onStateChanged);
            this.pageModel.downloader.start();
        },
        'onStateChanged': function (download, status) {
            if (download.state === 2 && status === 404) {
                this.pageModel.isDownload = false;
                download.abort();
                plus.nativeUI.alert('没有找到更新包资源，请联系技术人员进行排查', null, '更新失败');
            } else {
                var rat = (download.downloadedSize / download.totalSize * 100).toFixed(2);
                this.pageModel.downloadPer = rat;
            }
        },
        'downloadCompleted': function (d, status) {
            if (status !== 200) return;

            this.pageModel.isComplete = true;
            plus.runtime.install(d.filename, {}, function () {
                plus.nativeUI.alert('APP升级完成，点击“确定”按钮后重新启动。', function () {
                    plus.runtime.restart();
                }, '更新完成');
            }, function (e) {
                _vue.pageModel.isDownload = false;
                plus.nativeUI.alert('升级过程中出现了异常，详情：' + e.message, null, '更新失败');
            });
        },
        'closeNotice': function () {
            if (this.pageModel.isDownload) {
                APP.GLOBAL.toastMsg('正在升级中...');
                return;
            }

            plus.webview.getWebviewById('mainPage').evalJS('_vue.setWebviewMask(false)');
            plus.webview.currentWebview().close();
        }
    },
    created: function () {
        var objectParam = plus.webview.currentWebview().objectParams;
        this.request.baseUrl = objectParam.BaseUrl;
        this.request.version = objectParam.Version;
        this.request.des = objectParam.Des.replace(/\n/g, '</br>');

        window.backButton = this.closeNotice;
    }
});