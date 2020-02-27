var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'isLoading': true,
		'pageModel': [],
		'form': {
			'id': APP.GLOBAL.queryString('id'),
			'courseId': '',
			'chapterId': '',
			'isFinished': ''
		}
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'PersonIInspectedPersonalizedTasksDetail',
				data: {
					id: APP.GLOBAL.queryString('id')
				},
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
		'isDone': function(crouseId, chapterId, resourceId, isFinished) {
			this.form.courseId = crouseId;
			this.form.chapterId = chapterId;
			this.form.resourceId = resourceId;
			this.form.isFinished = !isFinished;
			this.isDoneAjax();
		},
		'isDoneAjax': function() {
			APP.GLOBAL.toastLoading({
				'message': '正在修改'
			});

			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'OperationPersonalizedTasksIsFinished',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.loadingPageData()
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
