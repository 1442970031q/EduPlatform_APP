Vue.use(vant.Lazyload, {
    'loading': '../../../content/img/center/list_head_bg.png',
    'error': '../../../content/img/center/list_head_bg.png',
    'attempt': 1
});
var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'height': document.body.clientHeight - 150,
        'pageModule': {
            'topThree': [],
            'other': []
        },
        'termList': [],
        'currentTermNumber': 0,
        'currentETY': 2,
        'type': 1,
        'isTimeShow': false,
        'isLoading': true
    },
    methods: {
        'termConfirm': function (item) {
            this.currentTermNumber = item.value;
            this.isLoading = true;
            this.loadingPageData();

            this.isTimeShow = false;
        },
        'changeETY': function (ety) {
            if (this.currentETY === ety) return;

            this.currentETY = ety;
            this.isLoading = true;
            this.loadingPageData();
        },
        'loadResultKPIAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ResultKPILoadData',
                success: function (result) {
                    if (result.Error || result.Data.TermList.length === 0) {
                        _vue.isLoading = false;
                        return;
                    }

                    for (var i = 0; i < result.Data.TermList.length; i++) {
                        _vue.termList.push({
                            'text': result.Data.TermList[i].TermName,
                            'value': result.Data.TermList[i].TermNum
                        });
                    }
                    _vue.currentTermNumber = result.Data.TermList[0].TermNum;
                    _vue.loadingPageData();
                }
            });
        },
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ResultKPIList',
                data: {
                    'termNum': this.currentTermNumber,
                    'ety': this.currentETY
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModule.topThree = result.Data.splice(0, 3);
                    _vue.pageModule.other = result.Data;
                    _vue.isLoading = false;
                }
            });
        }
    },
    computed: {
        'getTimeText': function () {
            for (var i = 0; i < this.termList.length; i++) {
                if (this.termList[i].value === this.currentTermNumber) {
                    return this.termList[i].text + ' / ' + (this.currentETY === 2 ? '期中' : '期末');
                }
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.left = document.body.clientWidth * 0.335;
    },
    mounted: function () {
        this.loadResultKPIAjax();
    }
});
