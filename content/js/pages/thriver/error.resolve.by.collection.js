var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'request': {
            'chapterIds': APP.GLOBAL.queryString('chapterIds')
        },
        'pageModel': {
            'ChoiceList': []
        },
        'currentSelected': -1,
        'isLoading': true,
        'statusbarHeight': 20
    },
    methods: {
        'removeConfirm': function (item) {
            APP.GLOBAL.confirmMsg({
                'messageAlign': 'left',
                'title': '移除确认',
                'message': '确定要移除该错误题目记录吗？</br>注意：移除后无法恢复！',
                'confirmCallback': function () {
                    APP.GLOBAL.toastLoading('正在移除');
                    _vue.doRemoveQuestionAjax(item);
                }
            });
        },
        'doRemoveQuestionAjax': function (item) {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'DeleteMistakesCollectionSubject',
                data: {
                    'cId': item.ChapterId,
                    'tmTy': item.Ty,
                    'tmId': item.TId
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < _vue.pageModel.ChoiceList.length; i++) {
                        if (_vue.pageModel.ChoiceList[i].TId === item.TId) {
                            _vue.pageModel.ChoiceList.splice(i, 1);
                            break;
                        }
                    }

                    if (_vue.pageModel.ChoiceList.length === 0) {
                        APP.GLOBAL.closeWindow();
                    }
                }
            });
        },
        'filterHtml': function (text) {
            return text.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, '').substring(0, 40);
        },
        'getTitle': function () {
            if (this.isLoading || this.pageModel.ChoiceList.length === 0) return '错题解析';

            return '错题解析(' + this.pageModel.ChoiceList.length + ')';
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
                url: APP.CONFIG.BASE_URL + 'AnalysisMistakesCollection',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    result.JsonStr = result.JsonStr.replace(/\n/g, '');
                    var choiceList = eval('(' + result.JsonStr + ')');
                    _vue.pageModel.ChoiceList = choiceList;
                    _vue.isLoading = false;
                }
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadPageData();
    }
});
