var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'tId': APP.GLOBAL.queryString('tId'),
            'bEId': APP.GLOBAL.queryString('bEId'),
            'eCount': APP.GLOBAL.queryString('ec')
        },
        'pageModel': {
            'tempQuestions': [],
            'ChoiceList': []
        },
        'options':['A','B','C','D'],
        'currentSelected': -1,
        'isLoading': true,
        'statusbarHeight': 20
    },
    methods: {
        'getRealOption': function (qIndex, question) {
            var _getOption = function (userSelect) {
                var q = _vue.pageModel.tempQuestions[qIndex];
                for (var i = 0; i < q.Options.length; i++) {
                    if (q.Options[i].Caption.toLowerCase() === userSelect.toLowerCase()) return i;
                }

                return -1;
            };

            var userRealAnswer = [];
            var answers = question.SAnswer.split('|');
            for (var j = 0; j < answers.length; j++) {
                var index = _getOption(answers[j]);
                if (index === - 1) continue;

                userRealAnswer.push(this.options[index]);
            }

            return userRealAnswer.sort().join('，');
        },
        'isError': function (question) {
            return question.SAnswer !== question.Answer;
        },
        'isOptionContains': function (question, option) {
            return question.Answer.indexOf(option.Caption) !== -1;
        },
        'getQuestionCaption': function (q) {
            for (var i = 0; i < this.pageModel.tempQuestions.length; i++) {
                if (this.pageModel.tempQuestions[i].TId === q.TId) {
                    return this.pageModel.tempQuestions[i].Question;
                }
            }

            return '';
        },
        'getQuestionOptions': function (q) {
            for (var i = 0; i < this.pageModel.tempQuestions.length; i++) {
                if (this.pageModel.tempQuestions[i].TId === q.TId) {
                    return this.pageModel.tempQuestions[i].Options;
                }
            }

            return [];
        },
        'getTitle': function () {
            if (this.isLoading || this.pageModel.ChoiceList.length === 0) return '错题解析';

            if (this.request.eCount) {
                return '错题解析(' + this.request.eCount + ')';
            } else {
                return '错题解析(' + this.pageModel.ChoiceList.length + ')';
            }
        },
        'getOptionIndex': function (option, index) {
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

            return opt + '、' + option.OptionContent;
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + (this.request.bEId ? 'AnalysisBrushExercise' : 'AnalysisBrushExerciseTest'),
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.ChoiceList = result.Data;
                    _vue.isLoading = false;
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        var tempStr = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.TEMP_QUESTION_LIST_KEY);
        var tempQuestions = JSON.parse(tempStr);
        this.pageModel.tempQuestions = tempQuestions;
    },
    mounted: function () {
        this.loadPageData();
    }
});
