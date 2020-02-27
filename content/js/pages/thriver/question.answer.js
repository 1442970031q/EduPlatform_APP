var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isEmoticonShow': false,
        'isActionsheet': false,
        'actions': [{
            'name': '拍照选取',
            'callback': null
        }, {
            'name': '从相册选取',
            'callback': null
        }],
        'pageModel': {
            'emtoiconList': [],
            'images': [],
            'answer':''
        },
        'form': {
            'pbId': APP.GLOBAL.queryString('qId'),
            'answer': ''
        },
        'statusbarHeight': 20
    },
    methods: {
        'checkData': function () {
            if (!this.pageModel.answer && this.pageModel.images.length === 0) {
                APP.GLOBAL.toastMsg('请输入您的回答');
                return;
            }

            var answerHtml = '<p>' + this.pageModel.answer.replace(/\n/g, '</p><p>') + '</p>';
            for (var i = 0; i < this.pageModel.images.length; i++) {
                if (this.pageModel.images[i].isUploading) {
                    APP.GLOBAL.toastMsg('请等待图片上传');
                    return;
                }

                if (this.pageModel.images[i].serverFileName) {
                    answerHtml += '<img src="' + this.pageModel.images[i].serverFileName + '"/>';
                }
            }

            this.form.answer = answerHtml;
            this.doSubmitAjax();
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'AnswerProblemBoard',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (APP.CONFIG.IS_RUNTIME) {
                        var wb = plus.webview.getWebviewById('question.detailPage');
                        wb.evalJS('_vue.reloadData()');
                    }

                    APP.GLOBAL.closeWindow();
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
        'controlFocus': function () {
            this.isEmoticonShow = false;
            this.isActionsheet = false;
        },
        'showEmoticon': function () {
            this.isEmoticonShow = true;
            this.isActionsheet = false;
        },
        'showActionsheet': function () {
            this.isEmoticonShow = false;
            this.isActionsheet = true;
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
            }, function () {
                _vue.compressCompleted(fileName, originalFileName);
            }, function (error) {
                APP.GLOBAL.toastMsg(error.message);
            });
        },
        'compressCompleted': function (fileName, originalFileName) {
            var url = APP.CONFIG.BASE_URL + 'UploadAPPUeditorImage';
            var uploader = plus.uploader.createUpload(url, { 'timeout': 180 }, function (result) {
                var json = JSON.parse(result.responseText);
                _vue.uploadComplete(json, originalFileName);
            });
            uploader.addFile(fileName, {
                'key': 'imageFile'
            });
            uploader.addData('key', this.currentUser.Key);
            uploader.start();
        },
        'uploadComplete': function (result, originalFileName) {
            if (result.Error) {
                APP.GLOBAL.toastMsg(result.Msg);
                return;
            }

            var index = this.imageIndexOf(originalFileName);
            if (index !== -1) {
                this.pageModel.images[index].isUploading = false;
                this.pageModel.images[index].serverFileName = result.ImageSrc;
            }
        },
        'loadEmoticons': function () {
            plus.io.resolveLocalFileSystemURL('_www/content/img/emoticon', function (entry) {
                var reader = entry.createReader();
                reader.readEntries(_vue.entryComplete);
            });
        },
        'entryComplete': function (entrys) {
            for (var i = 0; i < entrys.length; i++) {
                if (entrys[i].isFile) {
                    _vue.pageModel.emtoiconList.push({
                        'src': '../../content/img/emoticon/' + entrys[i].name,
                        'name': entrys[i].name.substring(0, entrys[i].name.indexOf('.'))
                    });
                }
            }

            _vue.isLoading = false;
        },
        'selectedEmoticon': function (item) {
            this.pageModel.answer += '[' + item.name + ']';
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
        if (APP.CONFIG.IS_RUNTIME) {
            this.loadEmoticons();
        } else {
            this.isLoading = false;
        }
    }
});
