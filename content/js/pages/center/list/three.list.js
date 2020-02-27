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
		'type': 1,
		'isLoading': true
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'IntegralRanking',
				data: {
					'ty': this.type
				},
				success: function(result) {
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
		'changeType': function(t) {
			this.type = t;
			this.isLoading = true;
			this.loadingPageData();
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.left = document.body.clientWidth * 0.335;
		this.loadingPageData();
	}
});
