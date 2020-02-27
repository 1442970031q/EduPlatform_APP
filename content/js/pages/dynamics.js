Vue.use(vant.Lazyload, {
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'height': 0,
        'crouse': ['0'],
        'page': {
            'recommend': {
                'data': '',
                'isLoading': true
            },
            'example': {
                'data': '',
                'isLoading': true
            },
            'news': {
                'data': '',
                'isLoading': true
            },
            'timetable': {
                'isLoading': true,
                'isLoaded': false,
                'isLoadWeekList': false,
                'weekList': [],
                'currentWeek': 0,
                'table': [],
                'currentWeekNumber':0
            },
            'isLoadingRefresh': false,
            'index': 0,
            'minHeight':document.body.clientHeight
        },
        'defaultImg': {
            'quare': '../content/img/conversion/default_conversion_block.jpg',
            'rectangle': '../content/img/dynamics/default_news.jpg'
        }
    },
    methods: {
        'onRefresh': function () {
            if (this.page.index === 0 && !this.page.recommend.isLoading) {
                this.loadPageRecommendData();
            } else if (this.page.index === 1 && !this.page.example.isLoading) {
                this.loadPageExampleData();
            } else if (this.page.index === 2 && !this.page.news.isLoading ) {
                this.loadPageNewsData();
            } else if (this.page.index === 3 && !this.page.timetable.isLoading) {
                if (this.page.timetable.currentWeek !== this.page.timetable.currentWeekNumber) {
                    this.doLoadWeekList();
                } else {
                    this.loadtimeTableData();
                }
            }
        },
        'previousWeek': function () {
            if (this.page.timetable.currentWeek <= 0 ||
                this.page.timetable.isLoadWeekList) return;

            this.page.timetable.isLoadWeekList = true;
            this.page.timetable.currentWeek--;
            this.doLoadWeekList();
        },
        'nextWeek': function () {
            if (this.page.timetable.currentWeek >= this.page.timetable.weekList.length - 1 ||
                this.page.timetable.isLoadWeekList) return;

            this.page.timetable.isLoadWeekList = true;
            this.page.timetable.currentWeek++;
            this.doLoadWeekList();
        },
        'doLoadWeekList': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'SearchClassSchedule',
                data: {
                    'week': this.page.timetable.weekList[this.page.timetable.currentWeek].Num
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    result.JsonStr = result.JsonStr.replace(/\n/g, '');
                    var data = eval('(' + result.JsonStr + ')');
                    data = data.sort(function (a, b) {
                        if (a.WeekNum === b.WeekNum) return 0;
                        else if (a.WeekNum < b.WeekNum) return -1;
                        else return 1;
                    });
                    _vue.page.timetable.table = data;
                    _vue.page.timetable.isLoadWeekList = false;

                    if (_vue.page.isLoadingRefresh) {
                        setTimeout(function () { _vue.page.isLoadingRefresh = false; }, 200);
                    }
                }
            });
        },
        'tabChanged': function (index) {
            this.page.index = index;
            if (index === 3 && !this.page.timetable.isLoaded) {
                this.page.timetable.isLoaded = true;
                this.loadtimeTableData();
            }
        },
        'getBeginTime': function () {
            return this.page.timetable.weekList[this.page.timetable.currentWeek].Begin;
        },
        'getEndTime': function () {
            return this.page.timetable.weekList[this.page.timetable.currentWeek].End;
        },
        'getWeekName': function (number) {
            switch (number) {
                case 1:
                    return '周一';
                case 2:
                    return '周二';
                case 3:
                    return '周三';
                case 4:
                    return '周四';
                case 5:
                    return '周五';
                case 6:
                    return '周六';
                default:
                    return '周日';
            }
        },
        'allEmpty': function (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].ChapterName) {
                    return false;
                }
            }

            return true;
        },
        'loadtimeTableData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ClassScheduleLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    result.Data.JsonStr = result.Data.JsonStr.replace(/\n/g, '');
                    var data = eval('(' + result.Data.JsonStr + ')');
                    data = data.sort(function (a, b) {
                        if (a.WeekNum === b.WeekNum) return 0;
                        else if (a.WeekNum < b.WeekNum) return -1;
                        else return 1;
                    });
                    _vue.page.timetable.table = data;
                    _vue.page.timetable.weekList = result.Data.TeachingWeekList;
                    _vue.page.timetable.currentWeek = result.Data.CurrentWeek;
                    _vue.page.timetable.currentWeekNumber = result.Data.CurrentWeek;
                    _vue.page.timetable.isLoading = false;

                    if (_vue.page.isLoadingRefresh) {
                        setTimeout(function () { _vue.page.isLoadingRefresh = false; }, 200);
                    }
                }
            });
        },
        'loadPageRecommendData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'RecommendLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.page.recommend.data = result.Data;
                    _vue.page.recommend.isLoading = false;

                    if (_vue.page.isLoadingRefresh) {
                        setTimeout(function () { _vue.page.isLoadingRefresh = false; }, 200);
                    }
                }
            });
        },
        'loadPageExampleData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ExampleLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.page.example.data = result.Data;
                    _vue.page.example.isLoading = false;

                    if (_vue.page.isLoadingRefresh) {
                        setTimeout(function () { _vue.page.isLoadingRefresh = false; }, 200);
                    }
                }
            });
        },
        'loadPageNewsData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'CollegeHeadlinesLoadData',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var arr = JSON.parse(result.JsonStr);
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].ImageSrc = {
                            'src': arr[i].ImageSrc,
                            'loading': '../content/img/dynamics/default_news.jpg',
                            'error': '../content/img/dynamics/default_news.jpg'
                        };
                    }
                    _vue.page.news.data = arr;
                    _vue.page.news.isLoading = false;

                    if (_vue.page.isLoadingRefresh) {
                        setTimeout(function () { _vue.page.isLoadingRefresh = false; }, 200);
                    }
                }
            });
        },
        'gotoListPage': function (id, name) {
            var obj = {
                id: id,
                name: name
            };

            APP.GLOBAL.gotoNewWindow('dynamics/student.list', {
                'param': 'obj=' + JSON.stringify(obj)
            });
        },
        'gotoDeatil': function (item, type) {
            if (type === 1) {
                APP.GLOBAL.gotoNewWindow('dynamics/weekly.detail', {
                    'param': 'wId=' + item.Id
                });
            } else if (type === 2) {
                APP.GLOBAL.gotoNewWindow('dynamics/public.crouse.detail', {
                    'paramObject': item
                });
            } else if (type === 3) {
                APP.GLOBAL.gotoNewWindow('dynamics/public.video.detail', {
                    param: 'Id=' + item.Id + '&img=' + encodeURIComponent(item.ImageSrc)
                });
            }
        },
        'gotoNewsDeatil': function (id, name) {
            var obj = {
                id: id,
                name: name
            };

            APP.GLOBAL.gotoNewWindow('dynamics/news.detail', {
                paramObject: obj
            });
        },
        'gotoStudnetDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('dynamics/student.info', {
                paramObject: item
            });
        },
        'gotoScan': function () {
            APP.GLOBAL.gotoNewWindow('subpages/scan.qr', {
                'openCallback': function () {
                    plus.webview.getWebviewById('scan.qrPage').evalJS('_vue.init()');
                    plus.navigator.setStatusBarStyle('light');
                },
                'closeCallback': function () {
                    plus.navigator.setStatusBarStyle('dark');
                }
            });
        },
        'isLikeWekkly': function (id, islike) {
            APP.GLOBAL.toastLoading(islike ? '正在点赞' : '正在取消');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'LikeWeekly',
                data: {
                    'wId': id,
                    'isLike': islike
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.loadPageRecommendData();
                }
            });

        },
        'gotoNewsAll': function (item) {
            APP.GLOBAL.gotoNewWindow('dynamics/academic.activity', {
                paramObject: item
            });
        },
        'updateUser': function () {
            Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.height = document.body.clientHeight - (this.statusbarHeight + 45 + 50);
    },
    mounted: function () {
        this.loadPageRecommendData();
        this.loadPageExampleData();
        this.loadPageNewsData();
    }
});
