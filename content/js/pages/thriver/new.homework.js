var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isShowPicker': false,
        'display': {
            'chapterName':''
        },
        'pageModel': {
            'chapters': [],
            'images':[]
        },
        'form': {
            'tpId': '',
            'fileName':'',
            'remarks':''
        },
        'isActionsheet': false,
        'actions': [{
            'name': '拍照选取',
            'callback': null
        }, {
            'name': '从相册选取',
            'callback': null
        }],
        'statusbarHeight': 20
    },
    methods: {
        'checkData': function () {
            if (!this.form.tpId) {
                APP.GLOBAL.toastMsg('请选择章节名称');
            } else if (this.pageModel.images.length === 0) {
                APP.GLOBAL.toastMsg('至少需要上传一张图片');
            } else if (this.anyUploadImage()) {
                APP.GLOBAL.toastMsg('请等待图片上传完毕');
            }else {
                this.doSubmitAjax();
            }
        },
        'anyUploadImage': function () {
            for (var i = 0; i < this.pageModel.images.length; i++) {
                if (this.pageModel.images[i].isUploading) return true;
            }

            return false;
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');

            this.form.fileName = '';
            for (var i = 0; i < this.pageModel.images.length; i++) {
                var lastIndex = this.pageModel.images[i].serverFileName.lastIndexOf('/');
                var fn = this.pageModel.images[i].serverFileName.substring(lastIndex + 1);

                if (i !== this.pageModel.images.length - 1) {
                    this.form.fileName += fn + ',';
                } else {
                    this.form.fileName += fn;
                }
            }

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'SubHomework',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.gotoNewWindow('new.homework.success', {
                        'openCallback': function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'removeImage': function (item) {
            APP.GLOBAL.confirmMsg({
                'title': '移除图片',
                'message': '确定要删除这个图片吗？',
                'confirmCallback': function () {
                    _vue.removeImageFromArray(item);
                }
            });
        },
        'removeImageFromArray': function (item) {
            var index = this.imageIndexOf(item.src);
            if (index !== -1) {
                this.pageModel.images.splice(index, 1);
            }
        },
        'imageIndexOf': function (src) {
            for (var i = 0; i < this.pageModel.images.length; i++) {
                if (this.pageModel.images[i].src === src) {
                    return i;
                }
            }

            return -1;
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
            plus.io.resolveLocalFileSystemURL(captureFile, function (entry) {
                var fileName = APP.CONFIG.SYSTEM_NAME === 'ios' ? entry.toRemoteURL() : entry.toLocalURL();
                _vue.pageModel.images.push({
                    'src': fileName,
                    'isUploading': true,
                    'serverFileName': ''
                });
                _vue.doCompress(entry, fileName, _vue.pageModel.images.length + 1);
            });
        },
        'doCompress': function (entry, originalFileName, index) {
            var fileName = '_downloads/question(' + index + ').jpg';
            plus.zip.compressImage({
                'src': entry.toLocalURL(),
                'dst': fileName,
                'overwrite': true,
                'format': 'jpg',
                'width': 'auto',
                'height': 'auto',
                'quality': 80
            }, function (event) {
                _vue.compressCompleted(event, originalFileName);
            }, function (error) {
                APP.GLOBAL.toastMsg(error.message);
            });
        },
        'compressCompleted': function (event, originalFileName) {
            var reader = new plus.io.FileReader();
            reader.onloadend = function (e) {
                var base64 = e.target.result.toString().replace('data:image/jpeg;base64,', '');
                APP.GLOBAL.ajax({
                    url: APP.CONFIG.BASE_URL + 'UplaodHomeworkImage',
                    data: {
                        'base64Str': encodeURIComponent(base64)
                    },
                    success: function (result) {
                        if (result.Error) {
                            APP.GLOBAL.toastMsg(result.Msg);
                            return;
                        }

                        var index = _vue.imageIndexOf(originalFileName);
                        if (index !== -1) {
                            _vue.pageModel.images[index].isUploading = false;
                            _vue.pageModel.images[index].serverFileName = result.AvatarImage;
                        }
                    }
                });
            };

            reader.onerror = function (fe) {
                APP.GLOBAL.toastMsg('读取错误：' + fe.error);
            };

            reader.readAsDataURL(event.target.replace('file://', ''));
        },
        'chapterConfirm': function (item) {
            this.isShowPicker = false;
            this.display.chapterName = item.text;
            this.form.tpId = item.id;
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'HomeworkLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < result.Data.length; i++) {
                        _vue.pageModel.chapters.push({
                            'text': result.Data[i].Name,
                            'id': result.Data[i].Id
                        });
                    }
                    _vue.isLoading = false;
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.actions[0].callback = this.openCamera;
        this.actions[1].callback = this.openGallery;
    },
    mounted: function () {
        this.loadPageData();
    }
});
