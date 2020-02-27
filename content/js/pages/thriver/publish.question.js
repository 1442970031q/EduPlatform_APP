var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoadFiles': true,
        'isLoading': true,
        'isEmoticonShow': false,
        'isActionsheet': false,
        'isShowPicker': false,
        'tagColumns': [],
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
            'tags': [],
            'supplementary': ''
        },
        'form': {
            'title': '',
            'supplementary': '',
            'tag': ''
        },
        'statusbarHeight': 20
    },
    methods: {
        'removeTag': function (t) {
            for (var i = 0; i < this.pageModel.tags.length; i++) {
                if (this.pageModel.tags[i] === t) {
                    this.pageModel.tags.splice(i, 1);
                    return;
                }
            }
        },
        'tagConfirm': function (item) {
            this.isShowPicker = false;

            for (var i = 0; i < this.pageModel.tags.length; i++) {
                if (this.pageModel.tags[i] === item.text) {
                    return;
                }
            }

            this.pageModel.tags.push(item.text);
        },
        'checkData': function () {
            if (!this.form.title) {
                APP.GLOBAL.toastMsg('请输入标题内容');
                return;
            }

            if (this.pageModel.tags.length === 0) {
                APP.GLOBAL.toastMsg('请选择至少一个标签');
                return;
            }

            var answerHtml = '<p>' + this.pageModel.supplementary.replace(/\n/g, '</p><p>') + '</p>';
            for (var i = 0; i < this.pageModel.images.length; i++) {
                if (this.pageModel.images[i].isUploading) {
                    APP.GLOBAL.toastMsg('请等待图片上传');
                    return;
                }

                if (this.pageModel.images[i].serverFileName) {
                    answerHtml += '<img src="' + this.pageModel.images[i].serverFileName + '"/>';
                }
            }

            this.form.tag = this.pageModel.tags.join(',');
            this.form.supplementary = answerHtml;
            this.doSubmitAjax();
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'NewProblemBoard',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.gotoNewWindow('question.detail', {
                        'param': 'qId=' + result.Id,
                        'openCallback': function () {
                            APP.GLOBAL.toastMsg('发布成功');
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

            _vue.isLoadFiles = false;
        },
        'selectedEmoticon': function (item) {
            this.pageModel.supplementary += '[' + item.name + ']';
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardTagsList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < result.Data.length; i++) {
                        _vue.tagColumns.push({
                            'text': result.Data[i]
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
        if (APP.CONFIG.IS_RUNTIME) {
            this.loadEmoticons();
        } else {
            this.isLoadFiles = false;
        }

        this.loadPageData();
    }
});
