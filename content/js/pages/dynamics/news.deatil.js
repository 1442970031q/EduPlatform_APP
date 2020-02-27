var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'data':'',
		'obj':'',
		'isLoading':true
	},
	methods: {
		'loadingPageData': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'CollegeHeadlines',
				data:{
					'id':this.obj.id 
				},
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					
					_vue.data=result.Data;
					_vue.isLoading=false;
				}
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            this.obj = wb.paramObject;
		}
		this.loadingPageData();
	}
});
