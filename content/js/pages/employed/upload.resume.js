var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'width': document.body.clientWidth - 30,
		'show': true,
		'form': {
			'id': APP.GLOBAL.queryString('cid'),
			'uFileName': '',
			'fileSize': '',
			'base64Str': ''
		},
	},
	methods: {
		'isLoading': function(file, detail) {

			if (file.file.name.substr(file.file.name.length - 4, 4) != '.pdf') {
				APP.GLOBAL.toastMsg('不是pdf格式');
				return;
			}
			this.form.uFileName = file.file.name;
			this.form.fileSize = file.file.size;
			this.form.base64Str = encodeURIComponent(file.content.split(',')[1]);
			this.show = false;
		},
		'uploadingPDF': function() {
			APP.GLOBAL.toastLoading({
				'message': '正在上传'
			});
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'UploadUserResume',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.$toast.success('上传成功');
				}
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
	}
});
