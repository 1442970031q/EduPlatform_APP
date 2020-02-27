var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'height': 0,
		'checkId': 0,
		'activeNames': ['0'],
		'data': {
			'types': '',
			'details': '',
			'name': ''
		},
		'isLoading': true,
		'isLoadingDetail': true,
		'form': {
			'pageIndex': 1,
			'pageSize': 15,
			'tId': '',
		},
		'obj': '',
		'isLoadMore': false,
		'isLoadComplete': false
	},
	methods: {
		'loadPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ObtainEmploymentTypeSonList',
				data: {
					tId: this.obj.Id
				},
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					if (result.Data.length !== 0) {
						_vue.data.types = result.Data;
						_vue.checkId = _vue.data.types[0].Id;
						_vue.data.name = _vue.data.types[0].Name;
					} else {
						_vue.data = [];
					}

					_vue.isLoading = false;
					_vue.loadPageDataDetail();
				}
			});
		},
		'loadPageDataDetail': function() {
			this.form.tId = this.checkId;
			this.isLoadingDetail = true;
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ObtainEmploymentSubjectList',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.data.details = result.Data;
					_vue.isLoadingDetail = false;
				}
			});
		},
		'cehckCrouse': function(item) {
			this.checkId = item.Id;
			this.data.name = item.Name;
			this.isLoadComplete=false;
			this.form.pageIndex=1;
			this.loadPageDataDetail();
		},
		'loadMore': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ObtainEmploymentSubjectList',
				data: this.form,
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.data.details  = _vue.data.details .concat(result.Data);
					_vue.isLoadMore = false;
					if (result.Data.length < _vue.form.pageSize) {
						_vue.isLoadComplete = true;
					}
				}
			});
		},
		'scrollBottom': function() {
			if (!this.isLoadMore && !this.isLoadComplete) {
				this.isLoadMore = true;
				this.form.pageIndex++;
				this.loadMore();
			}
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            this.obj = wb.paramObject;
		}
		this.height = document.body.clientHeight - (45 + this.statusbarHeight);
		this.loadPageData();
		window.scrollBottom = this.scrollBottom;
	}
});
