var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'form': {
            'pageIndex': 1,
            'pageSize': 15
        },
        'pageModule': [],
        'isLoadding': true,
		'isLoadMore':false,
		'isLoadComplete':false
    },
    methods: {
        'onClose': function (clickPosition, instance) {
            switch (clickPosition) {
                case 'left':
                case 'cell':
                case 'outside':
                    instance.close();
                    break;
                case 'right':
                    Dialog.confirm({
                        message: '确定删除吗？'
                    }).then(() => {
                        instance.close();
                    });
                    break;
            }
        },
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'NoticeList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModule', result.Data);
                    _vue.isLoadding = false;
                }
            });
        },
        'gotoDetailPage': function (id) {
            APP.GLOBAL.gotoNewWindow('message.detail', {
                param: 'mId=' + id
            });
        },
		'loadMore': function () {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'NoticeList',
				data:this.form,
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
        this.loadingPageData();
		window.scrollBottom = this.scrollBottom;
    }
});