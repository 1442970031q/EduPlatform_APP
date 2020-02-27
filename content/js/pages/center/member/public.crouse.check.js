var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'pageModule': [],
        'isLoading': true,
        'stats': [],
        'show': false,
        'name': '',
        'time': 1
    },
    methods: {
		'getTimeZone': function(segNumber){
			if(segNumber === 1 || segNumber === 2){
				return '上午';
			}else{
				return '下午';
			}
		},
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PublicLessonStuAttendanceLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    if (result.JsonStr != "[]") {
                        Vue.set(_vue, 'pageModule', JSON.parse(result.JsonStr));
                    }

                    _vue.isLoading = false;
                }
            });
        },
        'gotoNewWinow': function (item) {
            if (typeof item === 'undefined') {
                this.show = true;
                return;
            }

            APP.GLOBAL.gotoNewWindow('public.crouse.check.list', {
                'param': 'type=1',
                paramObject: item
            });
        },
        'getCrouseName': function () {
            if (!this.name) {
                APP.GLOBAL.toastMsg('请输入名称');
                return;
            }

            APP.GLOBAL.gotoNewWindow('public.crouse.check.list', {
                'param': 'type=2',
                paramObject: {
                    name: this.name,
                    time: this.time
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
        this.loadingPageData();
    }
});
