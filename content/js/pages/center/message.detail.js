var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'isLoading': true,
		'pageModule': {}
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'NoticeDetail',
				data: {
					'id': APP.GLOBAL.queryString('mId')
				},
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					Vue.set(_vue, 'pageModule', result.Data);
					_vue.isLoading = false;
				}
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadingPageData();
	}
});
