var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'form': {
			'pageIndex': 1,
			'pageSize': 15,
			'ty': ''
		},
		'pageModel': [],
		'isLoading': true,
		'isLoadMore': false,
		'isLoadComplete': false
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'IntegrallRecordList',
				data: this.form,
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
		'gotoExchangeCoin': function() {
			if (!this.currentUser.IsCanExchange){
				 APP.GLOBAL.toastMsg('活动暂未开启');
				 return;
			}
			APP.GLOBAL.gotoNewWindow('exchange.coin')
		},
		'changeTab': function(ty) {
			if (ty === this.form.ty) return;
			this.form.ty = ty;
			this.form.pageIndex = 1;
			this.isLoading = true;
			this.isLoadComplete = false;
			this.loadingPageData()
		},
		'updatePage': function () {
		    Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
		},
		'loadMore': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'IntegrallRecordList',
				data: this.form,
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.pageModel = _vue.pageModel.concat(result.Data);
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
		}
		this.loadingPageData();
		window.scrollBottom = this.scrollBottom;

	}
});
