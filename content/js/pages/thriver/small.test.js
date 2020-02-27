var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isPopShow': false,
        'isLoading': true,
        'isFinished': false,
        'statusbarHeight': 20,
        'request': {
            'tId': APP.GLOBAL.queryString('id')
        },
        'pageModel': {
            'Seconds': 0,
            'ChoiceList': []
        },
        'currentSelected': 1,
        'answerList': [],
        'warningTime': 60,
        'player': null,
        'isPlayed': false,
        'loopHandler': null
    },
    methods: {
        'checkSelected': function (item) {
            if (this.answerList.length === 0) return false;

            var currentQuestion = this.pageModel.ChoiceList[this.currentSelected - 1];
            for (var i = 0; i < this.answerList.length; i++) {
                if (currentQuestion.TId === this.answerList[i].TId &&
                    this.answerList[i].Answer.indexOf(item.Caption) >= 0) {
                    return true;
                }
            }

            return false;
        },
        'getOptionIndex': function (index, item) {
            var opt = '';
            switch (index) {
                case 0:
                    opt = 'A';
                    break;
                case 1:
                    opt = 'B';
                    break;
                case 2:
                    opt = 'C';
                    break;
                case 3:
                    opt = 'D';
                    break;
            }

            return opt + '、' + item.OptionContent;
        },
        'lodaPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'BrushExerciseTestSubject',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        if (typeof result.IsFinished !== 'undefined') {
                            _vue.isLoading = false;
                            _vue.isFinished = true;
                        } else {
                            APP.GLOBAL.toastMsg(result.Msg);
                        }

                        return;
                    }

                    result.JsonStr = result.JsonStr.replace(/\n/g, '');
                    var questionList = eval('(' + result.JsonStr + ')');

                    _vue.pageModel.Seconds = result.Seconds;
                    _vue.pageModel.ChoiceList = questionList;
                    _vue.loopHandler = setInterval(_vue.loopTime, 1000);

                    _vue.isLoading = false;
                }
            });
        },
        'last': function () {
            if (this.currentSelected === 1) {
                APP.GLOBAL.toastMsg('不能再向上了');
                return;
            }

            this.currentSelected--;
        },
        'next': function () {
            var answerModel = this.answerList[this.currentSelected - 1];
            if (typeof answerModel === 'undefined' || answerModel.Answer.length === 0) {
                APP.GLOBAL.toastMsg('请选择该题目的答案');
            } else {
                this.currentSelected++;
            }

            if (this.currentSelected > this.pageModel.ChoiceList.length) {
                this.doSubmitAjax();
                return;
            }
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在提交');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'SubBrushExerciseTestAnswer',
                data: {
                    'tId': this.request.tId,
                    'jsonStr': this.getTestString()
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var tempList = JSON.stringify(_vue.pageModel.ChoiceList);
                    APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.TEMP_QUESTION_LIST_KEY, tempList);
                    window.onPageClose = null;

                    APP.GLOBAL.gotoNewWindow('small.test.result', {
                        'param': 'score=' + result.Score +
                            '&eCount=' + result.ErrorCount +
                            '&qCount=' + _vue.pageModel.ChoiceList.length +
                            '&tId=' + _vue.request.tId,
                        'openCallback': function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'getTestString': function () {
            for (var i = 0; i < this.answerList.length; i++) {
                var answerStr = '';
                for (var j = 0; j < this.answerList[i].Answer.length; j++) {
                    if (this.answerList[i].Answer[j]) {
                        answerStr += this.answerList[i].Answer[j] + '|';
                    }
                }

                this.answerList[i].Answer = answerStr.substring(0, answerStr.length - 1);
                delete this.answerList[i].index;
            }

            return JSON.stringify(this.answerList);
        },
        'getCardActive': function (index) {
            for (var i = 0; i < this.answerList.length; i++) {
                if (this.answerList[i].index === index && this.answerList[i].Answer.length !== 0) return true;
            }

            return false;
        },
        'checkAnswer': function (item) {
            var questionModel = this.pageModel.ChoiceList[this.currentSelected - 1];

            var _getAnswerModel = function (tId) {
                if (_vue.answerList.length === 0) return null;

                for (var i = 0; i < _vue.answerList.length; i++) {
                    if (_vue.answerList[i].TId === tId) return _vue.answerList[i];
                }

                return null;
            };

            var _searchAnswerIndex = function (option, answer) {
                for (var i = 0; i < answer.Answer.length; i++) {
                    if (answer.Answer[i] === option.Caption) return i;
                }

                return -1;
            };

            var answerModel = _getAnswerModel(questionModel.TId);
            if (answerModel === null) {
                answerModel = {
                    'TId': questionModel.TId,
                    'Answer': [item.Caption],
                    'Ty': questionModel.Ty,
                    'index': this.currentSelected - 1,
                    'ChapterId': questionModel.ChapterId
                };
                this.answerList.push(answerModel);
            } else {
                var answerIndex = _searchAnswerIndex(item, answerModel);
                if (answerIndex < 0) {
                    answerModel.Answer.push(item.Caption);
                } else {
                    answerModel.Answer.splice(answerIndex, 1);
                }

                answerModel.Answer.sort();
            }
        },
        'padLeft': function (v) {
            if (v.toString().length < 2) {
                return '0' + v;
            } else {
                return v;
            }
        },
        'loopTime': function () {
            this.pageModel.Seconds--;
            if (this.pageModel.Seconds <= 0) {
                this.pageModel.Seconds = 0;
                clearInterval(this.loopHandler);

                this.$dialog.alert({
                    'title': 'Time Over',
                    'message': '测试时间已到，您的单词测试已结束！\n注：由于您未答题完成，本次测试无法提交'
                }).then(function () {
                    window.onPageClose = null;
                    APP.GLOBAL.closeWindow();
                });
            }

            if (APP.CONFIG.IS_RUNTIME && this.pageModel.Seconds < this.warningTime && !this.isPlayed) {
                this.isPlayed = true;
                this.player.play();
            }
        },
        'resumeWork': function () {
            APP.GLOBAL.toastLoading('正在恢复');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GetBrushExerciseTestSurplusTime',
                data: {
                    'id': this.request.tId
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.Seconds = result.Seconds;
                    if (APP.CONFIG.IS_RUNTIME && result.Seconds <= 0) {
                        var wb = plus.webview.getWebviewById('thriver.htmlPage');
                        wb.evalJS('_vue.loadCurrentTabData()');
                    }
                }
            });
        }
    },
    computed: {
        'getTitle': function () {
            if (this.isLoading || this.isFinished) return '小测试';

            var h = Math.floor(this.pageModel.Seconds % (60 * 60 * 24) / (60 * 60));
            var m = Math.floor(this.pageModel.Seconds % (60 * 60) / 60);
            var s = Math.floor(this.pageModel.Seconds % 60);
            return this.padLeft(h) + ':' + this.padLeft(m) + ':' + this.padLeft(s);
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            window.onPageClose = function () {
                APP.GLOBAL.confirmMsg({
                    'title': '退出确认',
                    'message': '确定要退出本次小测试吗？\n注意：如果退出，已答题目将不会被提交！',
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
        }

        this.lodaPageData();
    }
});

document.addEventListener('resume', function () { _vue.resumeWork(); });
