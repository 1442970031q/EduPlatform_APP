Vue.use(vant.Lazyload, {
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'pageModel': {
            'scrollTop': 0,
            'tabPages': {
                'tab1': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'VideoLearningLoadData',
                    'postData': {},
                    'postCallback': 'tab_1_Loaded',
                    'swipes': [],
                    'block_1': [],
                    'block_2': [],
                    'block_3': []
                },
                'tab2': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'TermPlan',
                    'postData': {},
                    'postCallback': 'tab_2_Loaded',
                    'timeline': [],
                    'currentWeekNum': 0
                },
                'tab3': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'WeeklyLoadData',
                    'postData': {},
                    'postCallback': 'tab_3_Loaded',
                    'weekList': []
                },
                'tab4': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'BrushExerciseTest',
                    'postData': {},
                    'postCallback': 'tab_4_Loaded',
                    'block_1': '',
                    'testId': 0,
                    'serTime': '',
                    'testTime': ''
                },
                'tab5': {
                    'isLoaded': true
                },
                'tab6': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'MyHomeworkList',
                    'postCallback': 'tab_6_Loaded',
                    'model': {
                        'all': {
                            'isLoaded': true,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': ''
                            },
                            'list': []
                        },
                        'uncorrected': {
                            'isLoaded': false,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': 1
                            },
                            'list': []
                        },
                        'corrected': {
                            'isLoaded': false,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': 2
                            },
                            'list': []
                        },
                        'comments': {
                            'isLoaded': false,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': 3
                            },
                            'list': []
                        }
                    },
                    'workIndex': 0
                },
                'tab7': {
                    'isLoading': true,
                    'isLoaded': false,
                    'postUrl': 'ProblemBoardList',
                    'postCallback': 'tab_7_Loaded',
                    'model': {
                        'all': {
                            'isLoaded': true,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': ''
                            },
                            'list': []
                        },
                        'myQuestion': {
                            'isLoaded': false,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': 1
                            },
                            'list': []
                        },
                        'myAnswer': {
                            'isLoaded': false,
                            'isLoading': true,
                            'isLoadMore': false,
                            'isLoadComplete': false,
                            'postData': {
                                'pageIndex': 1,
                                'pageSize': 20,
                                'ty': 2
                            },
                            'list': []
                        }
                    },
                    'learnIndex': 0
                }
            }
        },
        'isReloading': false,
        'statusbarHeight': 20,
        'tabActive': 0
    },
    methods: {
        'filterHtml': function (text) {
            if (!text) return text;

            return text.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, '').substring(0, 40);
        },
        'onRefresh': function () {
            if (this.tabActive + 1 === 6) {
                this.pageModel.tabPages.tab6.model.all.postData.pageIndex = 1;
                this.pageModel.tabPages.tab6.model.uncorrected.postData.pageIndex = 1;
                this.pageModel.tabPages.tab6.model.corrected.postData.pageIndex = 1;
                this.pageModel.tabPages.tab6.model.comments.postData.pageIndex = 1;
            } else if (this.tabActive + 1 === 7) {
                this.pageModel.tabPages.tab7.model.all.postData.pageIndex = 1;
                this.pageModel.tabPages.tab7.model.myQuestion.postData.pageIndex = 1;
                this.pageModel.tabPages.tab7.model.myAnswer.postData.pageIndex = 1;
            }

            this.loadCurrentTabData();
        },
        'updateUser': function () {
            Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
        },
        'gotoNewReport': function (item) {
            APP.GLOBAL.gotoNewWindow('thriver/new.report', {
                'param': 'weeknum=' + item.WeekNum + '&pId=' + item.Id + '&isSub=' + item.IsSub,
                titleNView: {
                    titleText: '',
                    backgroundColor: '#ffffff',
                    buttons: [{
                        type: 'back',
                        background: '#ffffff',
                        float: 'left',
                        fontSrc: '../content/fonts/iconfont/iconfont.ttf',
                        text: '\ue628',
                        width: '45px',
                        onclick: function () {
                            plus.webview.getWebviewById('new.reportPage').close();
                        }
                    }, item.IsSub ? {} : {
                        type: 'none',
                        text: '发布周报',
                        fontSize: '14px',
                        width: '80px',
                        onclick: function () {
                            var wb = plus.webview.getWebviewById('new.reportPage');
                            wb.evalJS('_vue.publishReport()');
                        }
                    }],
                    tags: [{
                        tag: 'font',
                        textStyles: {
                            size: '18px'
                        },
                        id: 'font',
                        text: '编辑周报'
                    }],
                    type: 'float'
                },
                'softinputMode': 'adjustResize'
            });
        },
        'gotoWorkDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('thriver/work.detail', {
                'param': 'id=' + item.Id
            });
        },
        'getTime': function (time, index) {
            var arr = time.split('-');
            return arr[index - 1];
        },
        'tabChanged': function () {
            window.scroll(0, 0);

            var tab = this.pageModel.tabPages['tab' + (this.tabActive + 1)];
            if (!tab.isLoaded) {
                this.loadCurrentTabData();
            }
        },
        'loadTabDataByIndex': function (index) {
            var addIndex = index + 1;
            var tab = this.pageModel.tabPages['tab' + addIndex];
            tab.isLoaded = true;
            if (!tab.postUrl) {
                tab.isLoading = false;

                if (_vue.isReloading) {
                    _vue.isReloading = false;
                }
                return;
            }

            var tabPostData = null;
            if (addIndex === 6 || addIndex === 7) {
                var key = this.getModelKey(addIndex);
                tabPostData = tab.model[key].postData;
            } else {
                tabPostData = tab.postData;
            }

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + tab.postUrl,
                data: tabPostData,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    _vue[tab.postCallback](tab, result);
                    tab.isLoading = false;

                    if (_vue.isReloading) {
                        setTimeout(function () { _vue.isReloading = false; }, 200);
                    }
                }
            });
        },
        'loadCurrentTabData': function () {
            this.loadTabDataByIndex(this.tabActive);
        },
        'getModelKey': function (index) {
            if (index === 6) {
                if (this.pageModel.tabPages.tab6.workIndex === 0) return 'all';
                else if (this.pageModel.tabPages.tab6.workIndex === 1) return 'uncorrected';
                else if (this.pageModel.tabPages.tab6.workIndex === 2) return 'corrected';
                else if (this.pageModel.tabPages.tab6.workIndex === 3) return 'comments';
            } else {
                if (this.pageModel.tabPages.tab7.learnIndex === 0) return 'all';
                else if (this.pageModel.tabPages.tab7.learnIndex === 1) return 'myQuestion';
                else if (this.pageModel.tabPages.tab7.learnIndex === 2) return 'myAnswer';
            }
        },
        'tab_1_Loaded': function (tab, result) {
            for (var i = 0; i < result.Data.CaroueselList.length; i++) {
                tab.swipes.push({
                    'src': result.Data.CaroueselList[i].ImageSrc,
                    'loading': '../content/img/thriver/default_thriver_swipe.jpg',
                    'error': '../content/img/thriver/default_thriver_swipe.jpg'
                });
            }

            for (var l = 0; l < result.Data.MyCourseList.length; l++) {
                result.Data.MyCourseList[l].ImageSrc = {
                    'src': result.Data.MyCourseList[l].ImageSrc,
                    'loading': '../content/img/thriver/default_video_detail.jpg',
                    'error': '../content/img/thriver/default_video_detail.jpg'
                };
            }
            tab.block_1 = result.Data.MyCourseList;

            for (var k = 0; k < result.Data.RecommendCourseList.length; k++) {
                result.Data.RecommendCourseList[k].ImageSrc = {
                    'src': result.Data.RecommendCourseList[k].ImageSrc,
                    'loading': '../content/img/thriver/default_video_detail.jpg',
                    'error': '../content/img/thriver/default_video_detail.jpg'
                };
            }
            tab.block_2 = result.Data.RecommendCourseList;

            for (var j = 0; j < result.Data.MyChooseCourseList.length; j++) {
                result.Data.MyChooseCourseList[j].ImageSrc = {
                    'src': result.Data.MyChooseCourseList[j].ImageSrc,
                    'loading': '../content/img/thriver/default_video_detail.jpg',
                    'error': '../content/img/thriver/default_video_detail.jpg'
                };
            }
            tab.block_3 = result.Data.MyChooseCourseList;
        },
        'tab_2_Loaded': function (tab, result) {
            tab.currentWeekNum = result.CurrentWeekNum - 1;
            tab.timeline = JSON.parse(result.JsonStr);
        },
        'tab_3_Loaded': function (tab, result) {
            tab.weekList = JSON.parse(result.JsonStr);
        },
        'tab_4_Loaded': function (tab, result) {
            tab.testId = result.TestId;
            tab.serTime = result.SerTime;
            tab.testTime = result.TestTime;
        },
        'tab_6_Loaded': function (tab, result) {
            tab.model.all.postData.pageIndex++;
            tab.model.all.list = result.Data;
            tab.model.all.isLoading = false;
        },
        'tab_7_Loaded': function (tab, result) {
            tab.model.all.postData.pageIndex++;
            for (var i = 0; i < result.Data.length; i++) {
                result.Data[i].Avatar = {
                    'src': result.Data[i].Avatar,
                    'loading': '../content/img/default/default_avatar.jpg',
                    'error': '../content/img/default/default_avatar.jpg'
                };
            }
            tab.model.all.list = result.Data;
            tab.model.all.isLoading = false;
        },
        'focusQuestion': function (item) {
            APP.GLOBAL.toastLoading('正在操作');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardAttention',
                data: {
                    'pbId': item.Id,
                    'isAttention': !item.IsAttention
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': item.IsAttention ? '已取消' : '已关注',
                        'duration': 700
                    });
                    item.IsAttention = !item.IsAttention;
                }
            });
        },
        'gotoVideoDetail': function (item, ty) {
            APP.GLOBAL.gotoNewWindow('thriver/video.detail', {
                'param': 'id=' + item.Id + '&ty=' + ty + '&frm=video',
                'paramObject': item
            });
        },
        'gotoQuestionDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('thriver/question.detail', {
                'param': 'qId=' + item.Id
            });
        },
        'loadLearnMore': function (tabModel) {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MyHomeworkList',
                data: tabModel.postData,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tabModel.list = tabModel.list.concat(result.Data);
                    tabModel.isLoadMore = false;
                    tabModel.postData.pageIndex++;

                    if (tabModel.postData.pageSize > result.Data.length) {
                        tabModel.isLoadComplete = true;
                    }
                }
            });
        },
        'loadHomeworkMore': function (tabModel) {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardList',
                data: tabModel.postData,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tabModel.list = tabModel.list.concat(result.Data);
                    tabModel.isLoadMore = false;
                    tabModel.postData.pageIndex++;

                    if (tabModel.postData.pageSize > result.Data.length) {
                        tabModel.isLoadComplete = true;
                    }
                }
            });
        },
        'loadLearnData': function (tabModel) {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'ProblemBoardList',
                data: tabModel.postData,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    for (var i = 0; i < result.Data.length; i++) {
                        result.Data[i].Avatar = {
                            'src': result.Data[i].Avatar,
                            'loading': '../content/img/default/default_avatar.jpg',
                            'error': '../content/img/default/default_avatar.jpg'
                        };
                    }

                    tabModel.list = result.Data;
                    tabModel.postData.pageIndex++;
                    tabModel.isLoading = false;
                }
            });
        },
        'loadHomeworkData': function (tabModel) {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'MyHomeworkList',
                data: tabModel.postData,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tabModel.list = result.Data;
                    tabModel.postData.pageIndex++;
                    tabModel.isLoading = false;
                }
            });
        },
        'gotoSmallTest': function () {
            if (this.pageModel.tabPages.tab4.testId !== 0) {
                if (this.pageModel.tabPages.tab4.serTime < this.pageModel.tabPages.tab4.testTime) {
                    APP.GLOBAL.toastMsg('还未测试时间');
                } else {
                    APP.GLOBAL.gotoNewWindow('thriver/small.test', {
                        'param': 'id=' + this.pageModel.tabPages.tab4.testId,
                        'popGesture': 'none'
                    });
                }
            } else {
                APP.GLOBAL.toastMsg('您的小测试还未开启');
            }
        },
        'scrollBottom': function (top) {
            if (top <= 0) return;

            if (this.tabActive === 5) {
                var workModel = null;
                if (this.pageModel.tabPages.tab6.workIndex === 0) {
                    workModel = this.pageModel.tabPages.tab6.model.all;
                } else if (this.pageModel.tabPages.tab6.workIndex === 1) {
                    workModel = this.pageModel.tabPages.tab6.model.uncorrected;
                } else if (this.pageModel.tabPages.tab6.workIndex === 2) {
                    workModel = this.pageModel.tabPages.tab6.model.corrected;
                } else if (this.pageModel.tabPages.tab6.workIndex === 3) {
                    workModel = this.pageModel.tabPages.tab6.model.comments;
                }

                if (!workModel.isLoadMore && !workModel.isLoadComplete) {
                    workModel.isLoadMore = true;
                    this.loadHomeworkMore(workModel);
                }
            } else if (this.tabActive === 6) {
                var tabModel = null;
                if (this.pageModel.tabPages.tab7.learnIndex === 0) {
                    tabModel = this.pageModel.tabPages.tab7.model.all;
                } else if (this.pageModel.tabPages.tab7.learnIndex === 1) {
                    tabModel = this.pageModel.tabPages.tab7.model.myQuestion;
                } else if (this.pageModel.tabPages.tab7.learnIndex === 2) {
                    tabModel = this.pageModel.tabPages.tab7.model.myAnswer;
                }

                if (!tabModel.isLoadMore && !tabModel.isLoadComplete) {
                    tabModel.isLoadMore = true;
                    this.loadLearnMore(tabModel);
                }
            }
        }
    },
    directives: {
        drag: {
            bind: function (el) {
                var odiv = el;   //获取当前元素
                var elapsedTime = 0;
                odiv.ontouchstart = function (e) {
                    elapsedTime = new Date().getTime();
                    e.stopPropagation();
                    event.preventDefault();

                    //算出鼠标相对元素的位置
                    var disX = e.touches[0].clientX - odiv.offsetLeft;
                    var disY = e.touches[0].clientY - odiv.offsetTop;

                    odiv.ontouchmove = function (mEvent) {
                        mEvent.stopPropagation();

                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        var left = mEvent.touches[0].clientX - disX;
                        var top = mEvent.touches[0].clientY - disY;
                        if (left <= 20) {
                            left = 20;
                        }

                        if (left + 70 > document.body.clientWidth) {
                            left = document.body.clientWidth - 70;
                        }

                        if (top <= _vue.statusbarHeight + 109) {
                            top = _vue.statusbarHeight + 109;
                        }

                        var qHeight = APP.CONFIG.IsSafeArea() ? 155 : 125;
                        if (top + qHeight >= _vue.screenHeight) {
                            top = _vue.screenHeight - qHeight;
                        }

                        //移动当前元素
                        odiv.style.left = left + 'px';
                        odiv.style.top = top + 'px';
                    };

                    odiv.ontouchend = function () {
                        odiv.ontouchmove = null;

                        if (new Date().getTime() - elapsedTime < 100) {
                            APP.GLOBAL.gotoNewWindow('thriver/shortcut', {
                                'ani': 'fade-in'
                            });
                        }
                    };
                };
            }
        }
    },
    computed: {
        'height': function () {
            return document.body.clientHeight - (this.statusbarHeight + 89);
        },
        'screenHeight': function () {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                return plus.display.resolutionHeight;
            } else {
                return document.body.clientHeight;
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        window.scrollChange = function (scrollTop) {
            _vue.pageModel.scrollTop = scrollTop;
        };
    },
    watch: {
        'pageModel.tabPages.tab7.learnIndex': function (value) {
            if (value === 1 && !this.pageModel.tabPages.tab7.model.myQuestion.isLoaded) {
                this.pageModel.tabPages.tab7.model.myQuestion.isLoaded = true;
                this.loadLearnData(this.pageModel.tabPages.tab7.model.myQuestion);
            } else if (value === 2 && !this.pageModel.tabPages.tab7.model.myAnswer.isLoaded) {
                this.pageModel.tabPages.tab7.model.myAnswer.isLoaded = true;
                this.loadLearnData(this.pageModel.tabPages.tab7.model.myAnswer);
            }
        },
        'pageModel.tabPages.tab6.workIndex': function (value) {
            if (value === 1 && !this.pageModel.tabPages.tab6.model.uncorrected.isLoaded) {
                this.pageModel.tabPages.tab6.model.uncorrected.isLoaded = true;
                this.loadHomeworkData(this.pageModel.tabPages.tab6.model.uncorrected);
            } else if (value === 2 && !this.pageModel.tabPages.tab6.model.corrected.isLoaded) {
                this.pageModel.tabPages.tab6.model.corrected.isLoaded = true;
                this.loadHomeworkData(this.pageModel.tabPages.tab6.model.corrected);
            } else if (value === 3 && !this.pageModel.tabPages.tab6.model.comments.isLoaded) {
                this.pageModel.tabPages.tab6.model.comments.isLoaded = true;
                this.loadHomeworkData(this.pageModel.tabPages.tab6.model.comments);
            }
        }
    },
    mounted: function () {
        window.scrollBottom = this.scrollBottom;
        this.loadCurrentTabData();
    }
});
