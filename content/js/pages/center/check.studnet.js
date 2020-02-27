var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'pageModel': [],
		'isLoading': true
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'PersonIInspectedList',
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					Vue.set(_vue, 'pageModel', result.Data);
					_vue.isLoading = false;
				}
			});
		},
		'gotoCheckDeteil': function(item) {
			APP.GLOBAL.gotoNewWindow('check.student.paln', {
				param: 'item=' + JSON.stringify(item)
			})
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadingPageData()
	}
});
