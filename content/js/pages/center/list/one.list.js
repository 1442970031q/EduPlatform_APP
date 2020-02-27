Vue.use(vant.Lazyload, {
    'loading': '../../../content/img/default/default_avatar.jpg',
    'error': '../../../content/img/default/default_avatar.jpg',
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
        'type': 1,
        'isTimeShow': false,
        'timeList': [],
        'currentDate': new Date(),
        'maxDate': new Date(),
        'minDate': new Date(2019, 0, 1),
        'isLoading': true
    },
    methods: {
        'formatter': function (type, value) {
            if (type === 'year') {
                return value + '年';
            } else if (type === 'month') {
                return value + '月';
            }
            return value;
        },
        'confirmTime': function (item) {
            this.currentDate = item;
            this.isTimeShow = false;

            this.isLoading = true;
            this.loadingPageData();
        },
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProcessKPIList',
                data: {
                    'ty': this.type,
                    'date': this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1)
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
        },
        'changeType': function (t) {
            this.type = t;
            this.isLoading = true;
            this.loadingPageData();
        }
    },
    computed: {
        'getTimeText': function () {
            return '当前统计时间 ' + this.currentDate.getFullYear() + '年' + (this.currentDate.getMonth() + 1) + '月份';
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
        this.left = document.body.clientWidth * 0.335;
        this.loadingPageData();
    }
});