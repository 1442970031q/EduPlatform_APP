Vue.use(vant.Lazyload, {
	'attempt': 1
});
var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
        'tabs': {
            'tab_0': {
                'postUrl': 'ObtainEmploymentHeadlineLoadData',
                'postCallBack': 'callback_tab_0',
                'data': [],
                'isLoading': true,
            },
			'tab_1': {
				'postUrl': 'ObtainEmploymentVideoList',
                'postCallBack': 'callback_tab',
                'loadMoreCallback':'loadMore_tab',
				'form': {
					'pageIndex': 1,
					'pageSize': 15,
					'px': 1
				},
				'isLoading': true,
				'data': [],
				'isLoadMore': false,
				'isLoadComplete': false
			},
			'tab_2': {
				'postUrl': 'MyResumeLoadData',
				'postCallBack': 'callback_tab',
				'isLoading': true,
				'data': ''
			},
			'tab_3': {
				'text': ''
			},
			'tab_5': {
				'postUrl': 'InterviewRegistrationList',
                'postCallBack': 'callback_tab',
                'loadMoreCallback': 'loadMore_tab',
				'form': {
					'pageIndex': 1,
					'pageSize': 15,
					'ty': 1,
					'isSelf': false
				},
				'isLoading': true,
				'data':[],
				'isLoadMore': false,
				'isLoadComplete': false
			},
			'tab_6': {
				'postUrl': 'InterviewRegistrationList',
                'postCallBack': 'callback_tab',
                'loadMoreCallback': 'loadMore_tab',
				'form': {
					'pageIndex': 1,
					'pageSize': 15,
					'ty': 2
				},
				'isLoading': true,
				'data': [],
				'isLoadMore': false,
				'isLoadComplete': false
			}
		},
        'tab': {},
        'active': 0,
		'defaultImg': {
			'quare': '../content/img/conversion/default_conversion_block.jpg',
			'rectangle': '../content/img/thriver/default_thriver_swipe.jpg'
        },
        'statusbarHeight': 20
	},
	methods: {
        'loadPageData': function () {
            var data = '';
            if (!this.tab.postUrl) return;

            if (this.tab.form) {
                this.tab.form.pageIndex = 1;
                this.tab.isLoadMore = false;
                this.tab.isLoadComplete = false;
                data = this.tab.form;
            }

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + this.tab.postUrl,
                data: data,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue[_vue.tab.postCallBack](result);
                    _vue.tab.isLoading = false;                   
                }
            });
		},
        'changeTab': function (index) {
       
            this.tab = this.tabs['tab_' + index];
            if (!this.tab) {
                return;
            }
            this.tab.isLoading = true;
			this.loadPageData();
		},
        'changeTabsTab': function (index) {

            if (index === 1) {
                this.tab.form.isSelf = true;
            } else {
                this.tab.form.isSelf = false;
            }

            this.tab.isLoading = true;
			this.loadPageData();
		},
        'callback_tab': function (result) {
			 
            this.tab.data = result.Data;
            if (this.tab.form) {
                this.tab.form.pageIndex++; 
            }
        },
        'callback_tab_0': function (result) {
            var obj = JSON.parse(result.JsonStr);
            this.tab.data = obj;
        },
        'loadMore': function () {
       
            if (typeof this.tab.loadMoreCallback === 'undefined') return;

			APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + this.tab.postUrl,
                data: this.tab.form,
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

                    _vue[_vue.tab.loadMoreCallback](result);
				}
			});
        },
        'loadMore_tab': function (result) {
             
            this.tab.data = this.tab.data.concat(result.Data);
            this.tab.form.pageIndex++;
            this.tab.isLoadMore = false;
            if (result.Data.length < this.tab.form.pageSize) {
                this.tab.isLoadComplete = true;
            }
        },
		'changeResume': function(itme) {
            APP.GLOBAL.confirmMsg({
                'title': '重新上传',
                'message': '是否重新上传简历？',
                'confirmCallback': function () {
                    APP.GLOBAL.gotoNewWindow('employed/upload.resume', {
                        param: 'cid=' + itme.Id
                    });
                }
            });
		},
		'searchCompany': function() {
			if (!this.tabs.tab_3.text) {
				APP.GLOBAL.toastMsg('请输入搜索的企业');
				return;
			}
			
			APP.GLOBAL.gotoNewWindow('employed/serach.result', {
				param: 'name=' + this.tabs.tab_3.text
			});
		},
        'scrollBottom': function (top) {
            if (top <= 0 ) return;
			 
            if (!this.tab.isLoadMore && !this.tab.isLoadComplete) {
                this.tab.isLoadMore = true;
                this.loadMore();
            }
		},
		'updateUser': function() {
			Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
        },
        'gotoExperienceList': function (item) {
            APP.GLOBAL.gotoNewWindow('employed/experience.list', {
                paramObject: item
            });
        },
        'gotoExperienceDeatil': function (item) {
            APP.GLOBAL.gotoNewWindow('employed/experience.detail', {
                param: 'id=' + item.Id
            });
        },
		'gotoDeatil': function(item) {
			APP.GLOBAL.gotoNewWindow('employed/employed.video.detail', {
				param: 'Id=' + item
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
    },
    mounted: function () {
        this.tab = this.tabs.tab_0;
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
