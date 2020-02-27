Vue.use(vant.Lazyload, {
	'error': '../../content/img/conversion/default_conversion_block.jpg',
	'loading': '../../content/img/conversion/default_conversion_block.jpg',
	'attempt': 1
});

var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'pageModule': [],
		'isLoading': true,
		'form': {
			'pageIndex': 1,
			'pageSize': 15,
			'state': 1
		},
		'isLoadMore': false,
		'isLoadComplete': false
	},
	methods: {
		'loadingPageModule': function () {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'GoodsOrderList',
				data: this.form,
				success: function (result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					Vue.set(_vue, 'pageModule', result.Data);
					_vue.isLoading = false;
				}
			});
		},
		'loadMore': function () {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'GoodsOrderList',
				data: this.form,
				success: function (result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.pageModule = _vue.pageModule.concat(result.Data);
                    _vue.isLoadMore = false;

					if (result.Data.length < _vue.form.pageSize) {
						_vue.isLoadComplete = true;
					}
				}
			});
		},
		'scrollBottom': function () {
			if (!this.isLoadMore && !this.isLoadComplete) {
				this.isLoadMore = true;
				this.form.pageIndex++;
				this.loadMore();
			}
		}
	},
	created: function () {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadingPageModule();
		window.scrollBottom = this.scrollBottom;
	}
});
