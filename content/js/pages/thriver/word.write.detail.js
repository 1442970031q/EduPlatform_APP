var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isKeyboard': true,
        'isPlayed': false,
        'isActionShow': false,
        'isError': false,
        'statusbarHeight': 20,
        'request': {
            'wtId': APP.GLOBAL.queryString('wId')
        },
        'warningTime': 60,
        'pageModel': {
            'sec': 0,
            'currentIndex': 0,
            'list': [],
            'answers': [],
            'inputWord': '',
            'errMsg':''
        },
        'player': null,
        'loopHandler': null,
        'keyboard': [{
            'line': 1,
            'keys': [{
                'name': 'q',
                'isPress': false
            }, {
                'name': 'w',
                'isPress': false
            }, {
                'name': 'e',
                'isPress': false
            }, {
                'name': 'r',
                'isPress': false
            }, {
                'name': 't',
                'isPress': false
            }, {
                'name': 'y',
                'isPress': false
            }, {
                'name': 'u',
                'isPress': false
            }, {
                'name': 'i',
                'isPress': false
            }, {
                'name': 'o',
                'isPress': false
            }, {
                'name': 'p',
                'isPress': false
            }]
        }, {
            'line': 2,
            'keys': [{
                'name': 'a',
                'isPress': false
            }, {
                'name': 's',
                'isPress': false
            }, {
                'name': 'd',
                'isPress': false
            }, {
                'name': 'f',
                'isPress': false
            }, {
                'name': 'g',
                'isPress': false
            }, {
                'name': 'h',
                'isPress': false
            }, {
                'name': 'j',
                'isPress': false
            }, {
                'name': 'k',
                'isPress': false
            }, {
                'name': 'l',
                'isPress': false
            }]
        }, {
            'line': 3,
            'keys': [{
                'name': 'z',
                'isPress': false
            }, {
                'name': 'x',
                'isPress': false
            }, {
                'name': 'c',
                'isPress': false
            }, {
                'name': 'v',
                'isPress': false
            }, {
                'name': 'b',
                'isPress': false
            }, {
                'name': 'n',
                'isPress': false
            }, {
                'name': 'm',
                'isPress': false
            }]
        }]
    },
    methods: {
        'getProgText': function () {
            return this.pageModel.currentIndex + 1 + ' / ' + this.pageModel.list.length;
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'SubWordTest',
                data: {
                    'wtId': this.request.wtId,
                    'answerJsonStr': JSON.stringify(this.pageModel.answers)
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    window.onPageClose = null;

                    result.ErrorJsonStr = result.ErrorJsonStr.replace(/\n/g, '');
                    var errorlist = eval('(' + result.ErrorJsonStr + ')');
                    APP.GLOBAL.gotoNewWindow('word.write.result', {
                        'param': 'score=' + result.Score +
                            '&qCount=' + _vue.pageModel.list.length +
                            '&rCount=' + result.RightCount,
                        'paramObject': errorlist,
                        'openCallback': function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'prevWord': function () {
            if (this.pageModel.currentIndex <= 0) return;

            this.pageModel.currentIndex--;
            var model = this.pageModel.answers[this.pageModel.currentIndex];
            this.pageModel.inputWord = model.Answer;
        },
        'nextWord': function () {
            if (!this.pageModel.inputWord) {
                APP.GLOBAL.toastMsg('请输入该单词');
                return;
            }

            var model = this.pageModel.list[this.pageModel.currentIndex];
            var firstAnswerModel = this.firstAnswer(model.Id);
            if (firstAnswerModel === null) {
                this.pageModel.answers.push({
                    'Id': model.Id,
                    'Answer': this.pageModel.inputWord
                });
            } else {
                firstAnswerModel.Answer = this.pageModel.inputWord;
            }

            if (this.pageModel.currentIndex + 1 >= this.pageModel.list.length) {
                this.doSubmitAjax();
                return;
            }

            this.pageModel.currentIndex++;
            var answerModel = this.pageModel.answers[this.pageModel.currentIndex];
            if (typeof answerModel === 'undefined') {
                this.pageModel.inputWord = '';
            } else {
                this.pageModel.inputWord = answerModel.Answer;
            }
        },
        'firstAnswer': function (id) {
            if (this.pageModel.answers.length === 0) return null;

            for (var i = 0; i < this.pageModel.answers.length; i++) {
                if (this.pageModel.answers[i].Id === id)
                    return this.pageModel.answers[i];
            }

            return null;
        },
        'backspace': function () {
            this.pageModel.inputWord = this.pageModel.inputWord.substring(0, this.pageModel.inputWord.length - 1);
        },
        'keydown': function (key) {
            key.isPress = true;
            this.pageModel.inputWord += key.name;
        },
        'keyend': function (key) {
            setTimeout(function () {
                key.isPress = false;
            }, 100);
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WordTestWordList',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        _vue.isError = true;
                        _vue.pageModel.errMsg = result.Msg;
                        _vue.isLoading = false;
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.sec = result.Seconds;
                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;

                    _vue.loopHandler = setInterval(_vue.loopTime, 1000);
                }
            });
        },
        'padLeft': function (v) {
            if (v.toString().length < 2) {
                return '0' + v;
            } else {
                return v;
            }
        },
        'loopTime': function () {
            this.pageModel.sec--;
            if (this.pageModel.sec <= 0) {
                this.pageModel.sec = 0;
                clearInterval(this.loopHandler);

                this.$dialog.alert({
                    'title': 'Time Over',
                    'message': '测试时间已到，您的单词测试已结束！\n注：由于您未答题完成，本次测试无法提交'
                }).then(function () {
                    window.onPageClose = null;
                    APP.GLOBAL.closeWindow();
                });
            }

            if (APP.CONFIG.IS_RUNTIME && this.pageModel.sec < this.warningTime && !this.isPlayed) {
                this.isPlayed = true;
                this.player.play();
            }
        },
        'resumeWork': function () {
            APP.GLOBAL.toastLoading('正在恢复');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GetWordTestSurplusTime',
                data: {
                    'id': this.request.wtId
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.sec = result.Seconds;
                    if (APP.CONFIG.IS_RUNTIME && result.Seconds <= 0) {
                        var wb = plus.webview.getWebviewById('word.writePage');
                        wb.evalJS('_vue.reloadList()');
                    }
                }
            });
        }
    },
    computed: {
        'getTitle': function () {
            if (this.isLoading || this.isError) return '单词听写';

            var h = Math.floor(this.pageModel.sec % (60 * 60 * 24) / (60 * 60));
            var m = Math.floor(this.pageModel.sec % (60 * 60) / 60);
            var s = Math.floor(this.pageModel.sec % 60);
            return this.padLeft(h) + ':' + this.padLeft(m) + ':' + this.padLeft(s);
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            window.onPageClose = function () {
                APP.GLOBAL.confirmMsg({
                    'title': '退出确认',
                    'message': '确定要退出本次单词测试吗？\n注意：如果退出，已答题目将不会被提交！',
                    'confirmCallback': function () {
                        plus.webview.currentWebview().close();
                    }
                });
            };
        }
    },
    mounted: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.player = plus.audio.createPlayer({
                'src': '_www/content/sound/warning.wav'
            });

            this.player.addEventListener('canplay', function () {
                _vue.loadPageData();
            });
        } else {
            this.loadPageData();
        }
    }
});

document.addEventListener('resume', function () { _vue.resumeWork(); });
