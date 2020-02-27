var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'isLoading': true,
        'isClassListShow': false,
        'data': {
            'columns': '',
            'crouse': ''
        },
        'radio': {
            'id': 0,
            'Name': '点击选择课程'
        },
        'isCheckbox': true,
        'checkList': []
    },
    methods: {
        'choiceList': function () {
            if (this.checkList.length === this.data.crouse.length) {
                this.checkList = [];
            } else {
                for (var i = 0; i < this.data.crouse.length; i++) {
                    this.checkList.push(this.data.crouse[i].Id);
                }
            }
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CourseList',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data.columns = result.Data.CourseList;
                    _vue.isLoading = false;
                }
            });
        },
        'getSection': function (item) {
            this.isClassListShow = false;
            this.radio = item;
            this.checkList = [];

            APP.GLOBAL.toastLoading('加载章节');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ChapterList',
                data: {
                    'cId': item.Id
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data.crouse = result.Data;
                }
            });
        },
        'doBeginWork': function () {
            var str = '';
            for (var i = 0; i < this.data.crouse.length; i++) {
                if (this.checkList[i]) {
                    str = str + this.checkList[i] + ',';
                }
            }

            str = str.substring(0, str.length - 1);
            APP.GLOBAL.gotoNewWindow('homework.detail', {
                param: 'chapterId=' + str +
                    '&classId=' + this.radio.Id +
                    '&title=' + encodeURIComponent(this.radio.Name),
                popGesture: 'none'
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
