var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'request': {
            'cId': APP.GLOBAL.queryString('classId'),
            'chapterIds': APP.GLOBAL.queryString('chapterId'),
            'title': APP.GLOBAL.queryString('title')
        },
        'pageModel': {
            'BEId': 0,
            'ChoiceList': []
        },
        'currentSelected': 1,
        'answerList': [],
        'isPopShow': false,
        'isLoading': true
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
        'getTitle': function () {
            if (this.isLoading || this.pageModel.ChoiceList.length === 0) return '刷题';

            if (this.pageModel.ChoiceList[this.currentSelected - 1].Ty === 1) {
                return '客观题(' + (this.currentSelected + '/' + this.pageModel.ChoiceList.length) + ')';
            } else {
                return '主观题(' + (this.currentSelected + '/' + this.pageModel.ChoiceList.length) + ')';
            }
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
                url: APP.CONFIG.BASE_URL + 'BrushExercise',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModel', result.Data);
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
                url: APP.CONFIG.BASE_URL + 'SubBrushExerciseAnswer',
                data: {
                    'bEId': this.pageModel.BEId,
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

                    APP.GLOBAL.gotoNewWindow('do.homework.result', {
                        'param': 'score=' + result.Score +
                            '&eCount=' + result.ErrorCount +
                            '&qCount=' + _vue.pageModel.ChoiceList.length +
                            '&title=' + encodeURIComponent('课程：' + _vue.request.title) +
                            '&bEId=' + _vue.pageModel.BEId +
                            '&rat=' + numberFormat(result.RightRate, 0),
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
                    'index': this.currentSelected - 1
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
        'gotoQuestion': function (item, index) {
            var _getAnswerModel = function (tId) {
                if (_vue.answerList.length === 0) return null;

                for (var i = 0; i < _vue.answerList.length; i++) {
                    if (_vue.answerList[i].TId === tId) return _vue.answerList[i];
                }

                return null;
            };
            var answerModel = _getAnswerModel(item.TId);
            if (answerModel === null) {
                APP.GLOBAL.toastMsg('只能查看已答题目');
                return;
            }

            this.isPopShow = false;
            this.currentSelected = index + 1;
        },
        'gotoQuestionFeedback': function () {
            var feedbackObj = {
                'question': this.pageModel.ChoiceList[this.currentSelected - 1].Question,
                'ty': this.pageModel.ChoiceList[this.currentSelected - 1].Ty,
                'tqId': this.pageModel.ChoiceList[this.currentSelected - 1].TId,
                'cId': this.request.cId
            };

            APP.GLOBAL.setItem('question_feedback', JSON.stringify(feedbackObj));
            APP.GLOBAL.gotoNewWindow('question.feedback');
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            window.onPageClose = function () {
                APP.GLOBAL.confirmMsg({
                    'title': '退出确认',
                    'message': '确定要退出本次刷题吗？\n注意：如果退出，已答题目将不会被提交！',
                    'confirmCallback': function () {
                        plus.webview.currentWebview().close();
                    }
                });
            };
        }
    },
    mounted: function () {
        this.lodaPageData();
    }
});
