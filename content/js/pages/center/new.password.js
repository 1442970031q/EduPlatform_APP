var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'form': {
			'oldPwd': '',
			'newPwd': '',
			'key': ''
		},
		'password': ''
	},
	methods: {
		'checkData': function() {
			if (!this.form.oldPwd) {
				APP.GLOBAL.toastMsg('请输入旧密码');
				return;
			} else if (this.form.oldPwd.length < 6) {
				APP.GLOBAL.toastMsg('旧密码长度不足六位');
				return;
			} else if (!this.password) {
				APP.GLOBAL.toastMsg('请输入新密码');
				return;
			} else if (this.password.length < 6) {
				APP.GLOBAL.toastMsg('新密码长度不足六位');
				return;
			} else if (this.form.newPwd != this.password) {
				APP.GLOBAL.toastMsg('新密码两次输入不一致');
				return;
			} else {
				this.submitAjax()
			}
		},
		'submitAjax': function() {
			APP.GLOBAL.toastLoading('正在提交');

			this.form.key = this.currentUser.Key;
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'ChangePassword',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.$toast.success('修改成功');
					setTimeout(function(){
						APP.GLOBAL.closeWindow();
					},500)
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
