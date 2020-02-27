Vue.use(vant.Lazyload, {
	'error':'../../content/img/thriver/default_thriver_swipe.jpg',
	'loading': '../../content/img/thriver/default_thriver_swipe.jpg',
	'attempt': 1
});

var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'checked': true,
        'pageModule': {}
	},
	methods: {
		'gotoNewsDeatil': function(id,name) {
			var obj={
				id:id,
				name:name
			}
			APP.GLOBAL.gotoNewWindow('news.detail', {
                paramObject: obj
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            this.pageModule = wb.paramObject;
		}
	}
});
