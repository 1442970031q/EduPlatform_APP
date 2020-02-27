var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'isCheck': true,
		'isLoadding': true,
		'pageModule': [],
		'form':{
			'pageIndex':1,
			'pageSize':15,
			'name':APP.GLOBAL.queryString('name')
		}
	},
	methods: {
		'loadPageData': function () {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL +'EnterpriseInquiryList',
				data: this.form,
				success: function (result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					
					_vue.pageModule=result.Data;
					_vue.isLoadding=false;
				}
			});
		}
	},
	created: function () {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadPageData();
	}
});
