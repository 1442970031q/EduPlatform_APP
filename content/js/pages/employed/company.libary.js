var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'form':{
			'pageIndex':1,
			'pageSize':15,
			'title':''
		},
		'data':'',
		'isLoading':true,
		'isLoadMore':false,
		'isLoadComplete':false 
	},
	methods: {
		'onSearch': function() { 
			this.isLoading=true;
			this.loadPageData();
		},
		'loadPageData':function(){
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'EnterpriseSubjectList',
				data:this.form,
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
			APP.GLOBAL.gotoNewWindow('company.libary.detail', {
                paramObject: item 
			});
		},
		'loadMore': function () {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'EnterpriseSubjectList',
				data:this.form,
				success: function (result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
		
					_vue.data = _vue.data.concat(result.Data);
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
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.loadPageData();
		window.scrollBottom = this.scrollBottom;
	}
});
