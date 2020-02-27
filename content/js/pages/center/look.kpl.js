Vue.use(vant.Lazyload, {
	'loading': '../../content/img/center/list_head_bg.png',
	'error': '../../content/img/center/list_head_bg.png',
	'attempt': 1
});

var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'height': document.body.clientWidth * (800 / 700),
		'left': 0,
		'isLoading': true,
		'pageModule': {
			'dataAll': [],
			'dataUser': {
				"score": '暂无',
				"ranking": '暂无'
			}
		}
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ProcessKPIList',
				data: {
					'ty': 1
				},
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.pageModule.dataAll = result.Data;
					_vue.pageModule.dataUser= _vue.getUserData();
					_vue.isLoading = false;
				}
			});
		},
		'getUserData': function() {
			var data = this.pageModule.dataAll;
			var obj = {
				"score": '暂无',
				"ranking": '暂无'
			}

			for (var i = 0; i < data.length; i++) {
				if (data[i].IsHighlight) {
					obj.score = data[i].Score;
					obj.ranking = i + 1;
					return obj
				}
			}
			return obj
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.left = document.body.clientWidth * 0.335;
		this.loadingPageData()
	}
});
