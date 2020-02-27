Vue.use(VueHtml5Editor, {
    // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效 
    // global component name
    name: "vue-html5-editor",
    // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
    // if set true,will append module name to toolbar after icon
    showModuleName: false,
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 1024 * 1024 * 5,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
            url: APP.CONFIG.BASE_URL + 'UploadAPPUeditorImage',
            headers: {},
            params: {
                'key': APP.GLOBAL.getUserModel().Key
            }
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: {
            quality: .7
        },
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler: function (responseText) {
            APP.GLOBAL.closeToastLoading();

            var json = JSON.parse(responseText);
            if (json.Error) {
                _vue.$toast.fail(json.Msg);
            } else {
                return json.ImageSrc;
            }
        },
        errorUploadHandler: function () {
            APP.GLOBAL.closeToastLoading();
        },
        beforeUploadHandler: function () {
            APP.GLOBAL.toastLoading('正在上传图片');
        }
    },
    language: "zh-cn",
    visibleModules: [
        "text",
        "color",
        "font",
        "align",
        "list",
        "image",
        "tip"
    ],
    modules: [{
        name: "tip",
        icon: "fa fa-info-circle",
        show: true,
        handler: function (editor) {
            _vue.isNoticeShow = true;
        }
    }]
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isActionSheetShow': false,
        'isNoticeShow': false,
        'isAgain': false,
        'request': {
            'wId': APP.GLOBAL.queryString('pId') * 1,
            'isSubmit': APP.GLOBAL.queryString('isSub')
        },
        'pageModel': {},
        'form': {
            'weekNum': APP.GLOBAL.queryString('weeknum'),
            'title': '',
            'content': '',
            'isSub': false
        },
        'old': {
            'title': '',
            'content': ''
        },
        'actions': [{
            'name': '仅保存'
        }, {
            'name': '保存并发布'
        }],
        'statusbarHeight': 20
    },
    methods: {
        'onSelect': function (item, index) {
            if (index === 0) {
                if (this.request.wId === 0) {
                    this.doSaveReportAjax();
                } else {
                    this.doSubmitWeekReport(false);
                }
            } else {
                APP.GLOBAL.confirmMsg({
                    'title': '发布确认',
                    'message': '您确定要发布当前周报吗？<br/>注意：发布后将无法修改！',
                    'confirmCallback': function () {
                        _vue.doSubmitWeekReport(true);
                    }
                });
            }

            this.isActionSheetShow = false;
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyDetail',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (_vue.form.isSubmit !== 'true') {
                        _vue.old.title = result.Data.Title;
                        _vue.old.content = result.Data.WContent;
                    }

                    _vue.form.title = result.Data.Title;
                    _vue.form.content = result.Data.WContent;
                    _vue.isLoading = false;
                }
            });
        },
        'pageClosing': function () {
            if (this.form.title === this.old.title && this.form.content === this.old.content) {
                window.onPageClose = null;
                APP.GLOBAL.closeWindow();
                return;
            }

            APP.GLOBAL.confirmMsg({
                'title': '关闭确认',
                'message': '您的周报已经填写内容，是否保存本次的信息？',
                'confirmButtonText': '保存',
                'cancelButtonText': '放弃',
                'confirmCallback': function () {
                    _vue.doSubmitWeekReport(false);
                },
                'cancelCallback': function () {
                    window.onPageClose = null;
                    APP.GLOBAL.closeWindow();
                }
            });
        },
        'publishReport': function () {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.key.hideSoftKeybord();
            }

            if (!this.form.title) {
                APP.GLOBAL.toastMsg('请输入周报标题');
            } else if (!this.form.content) {
                APP.GLOBAL.toastMsg('请输入周报内容');
            } else {
                this.isActionSheetShow = true;
            }
        },
        'doSaveReportAjax': function () {
            APP.GLOBAL.toastLoading('正在保存');

            this.form.content = encodeURIComponent(this.form.content);
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'NewWeekly',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.updateThriver();
                    APP.GLOBAL.toastMsg('周报已更新成功');
                    window.onPageClose = null;
                    APP.GLOBAL.closeWindow();
                }
            });
        },
        'doSubmitWeekReport': function (isSub) {
            APP.GLOBAL.toastLoading(isSub ? '正在发布' : '正在保存');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'EditWeekly',
                data: {
                    'wId': this.request.wId,
                    'title': this.form.title,
                    'content': encodeURIComponent(this.form.content),
                    'isSub': isSub
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.updateThriver();

                    APP.GLOBAL.toastMsg(isSub ? '周报发布成功' : '周报已更新成功');
                    window.onPageClose = null;
                    APP.GLOBAL.closeWindow();
                }
            });
        },
        'updateThriver': function () {
            if (!APP.CONFIG.IS_RUNTIME) return;

            var wb = plus.webview.getWebviewById('thriver.htmlPage');
            if (wb !== null) {
                wb.evalJS('_vue.loadCurrentTabData()');
            }
        },
        'contentChange': function (e) {
            this.form.content = e;
        },
        'firstNotice': function () {
            var isShow = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.FIRST_NOTICE_KEY);
            if (isShow === null || isShow === 'false') {
                this.isNoticeShow = true;
            } else {
                this.isAgain = true;
            }
        },
        'onAgainChange': function (value) {
            APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.FIRST_NOTICE_KEY, value ? 'true' : 'false');
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        if (this.request.wId !== 0) {
            this.loadPageData();
        } else {
            this.isLoading = false;
        }

        this.firstNotice();
        window.onPageClose = this.pageClosing;
    }
});
