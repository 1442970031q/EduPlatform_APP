Vue.use(vant.Lazyload, {
	'attempt': 1
});
var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'vId': APP.GLOBAL.queryString('Id'),
		'data': '',
		'isLoading': true,
		'video': ''
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ObtainEmploymentVideoDetail',
				data: {
					oevId: this.vId
				},
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					Vue.set(_vue, 'data', result.Data);
					_vue.creteVaido(_vue.data.FileSrc);
				}
			});
		},
		'creteVaido': function(fileSrc) {
			this.video = new plus.video.VideoPlayer('video', {
				src: fileSrc,
				position: "absolute"
			});
			this.isLoading = false
			this.video.play()
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadingPageData();
	}
});
