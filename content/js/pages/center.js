Vue.use(vant.Lazyload, {
	'loading': '../content/img/default/default_avatar.jpg',
	'error': '../content/img/default/default_avatar.jpg',
	'attempt': 1
});

var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'isLearn': false,
		'isRefresh': false
	},
	methods: {
		'updateUser': function() {
			this.updatePage();
		},
		'gotoExchangePage': function(t) {
			APP.GLOBAL.gotoNewWindow('conversion/goods', {
				param: 'type=' + t
			});
		},
		'updatePage': function() {
			Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
		},
		'gotoOrdersDetail': function(state) {
			APP.GLOBAL.gotoNewWindow('center/my.order', {
				param: 'tIndex=' + state
			});
		},
		'gotoMemberMangmentPage': function() {
			if (!this.currentUser.IsEnglishRepresentative && !this.currentUser.IsGroupLeader && !this.currentUser.IsDisciplinaryCommissioner) {
				APP.GLOBAL.toastMsg('你没有相关操作权限');
				return;
			}
            APP.GLOBAL.gotoNewWindow('center/member.mangement');
		},
		'loadingIsBeginLearn': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'IsCanOpenOrCloseGroupStudy',
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.isLearn = result.IsCan;
				}
			});
		},
		'onRefresh': function() {
			this.currentUser = APP.GLOBAL.getUserModel();
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'IsCanOpenOrCloseGroupStudy',
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.isLearn = result.IsCan;
					_vue.isRefresh = false;
					_vue.$toast.success({
						'message': '刷新成功',
						'duration': 700
					});
				}
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadingIsBeginLearn();
    }
});
