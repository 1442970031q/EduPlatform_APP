var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'height': document.body.clientHeight,
		'width': document.body.clientWidth,
		'pageModel': [{
			"DirectionName": "暂无",
			"IsMain": true,
			"Lev": 1,
			"TotalScore": 4,
			"StudentScore": 3 
		}],
		'isLoading': true,
		'index': 0
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'EmploymentDirection',
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					
					Vue.set(_vue, 'pageModel', JSON.parse(result.JsonStr));
					_vue.isLoading = false;
				}
			});
		},
		'changeIndex': function() {
			this.index++;
			if (this.index > this.pageModel.length-1) {
				this.index = 0;
			}
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadingPageData()
	}
});
