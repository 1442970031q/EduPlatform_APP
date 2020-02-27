var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
	},
	methods: {
		'lookOrder':function(){
			APP.GLOBAL.gotoNewWindow('../center/my.order',{
				'closeCallback':function(){
					var wb=plus.webview.getWebviewById('goodsPage');
					if(wb){
						 wb.evalJS('_vue.closeWindow()')
					}
					APP.GLOBAL.closeWindow();
				}
			})
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
	}
});
