Vue.use(vant.Lazyload, {
	'loading': '../../content/img/conversion/default_conversion_block.jpg',
	'error': '../../content/img/conversion/default_conversion_block.jpg',
	'attempt': 1
});

var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'data': '',
		'isLoading':true
	},
	methods: {
		'loadPageData':function(){
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ObtainEmploymentTypeList',
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					
					_vue.data=result.Data;
					_vue.isLoading=false;
				}
			});
		},
		'gotoDetail':function(item){
			APP.GLOBAL.gotoNewWindow('java' , {
                paramObject: item
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadPageData();
	}
});
