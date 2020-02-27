var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'form': {
			'name': '默认',
			'class': '暂无',
			'specialtyDirection': '',
			'phone': '',
			'companyName': '',
			'companyAddress': '',
			'companyContacts': '',
			'contactsPhone': '',
            'entryPosition': '',
            'entryTime': new Date().getFullYear() + '-' + (new Date().getMonth() + 1 )+ '-'+new Date().getDate()
		},
		'show': false,
        'time': new Date(),
        'minDate': new Date((new Date().getFullYear()-2), 00, 01),
		'maxDate': new Date(),
	},
	methods: {
		'checkData': function() {
			if (!this.form.specialtyDirection) {
				APP.GLOBAL.toastMsg('专业方向未填写');
				return;

			} else if (!this.form.phone) {
				APP.GLOBAL.toastMsg('手机号码未填写');
				return;
			} else if (this.form.phone.length != 11) {
				APP.GLOBAL.toastMsg('手机号码位数不足11位');
				return;
			} else if (!this.form.companyName) {
				APP.GLOBAL.toastMsg('公司名称未填写');
				return;
			} else if (!this.form.companyAddress) {
				APP.GLOBAL.toastMsg('公司地址未填写');
				return;
			} else if (!this.form.companyContacts) {
				APP.GLOBAL.toastMsg('公司联系人未填写');
				return;
			} else if (!this.form.contactsPhone) {
				APP.GLOBAL.toastMsg('联系人电话未填写');
				return;
			} else if (this.form.contactsPhone.length != 11) {
				APP.GLOBAL.toastMsg('联系人电话位数不足11位');
				return;
			} else if (!this.form.entryPosition) {
				APP.GLOBAL.toastMsg('入职岗位未填写');
				return;
			} else if (!this.form.entryTime) {
				APP.GLOBAL.toastMsg('入职时间未填写');
				return;
			} else {
				this.submitDataAjax();
			}
		},
		'submitDataAjax': function() {
			APP.GLOBAL.toastLoading({
				'message': '正在提交'
			});

			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'NewEntryRegistration',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.$toast.success('提交成功');
				}
			});
		},
		'confirm': function(value) {
			this.form.entryTime = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			this.show = false;
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.form.name = this.currentUser.RealName;
        this.form.class = this.currentUser.UserInfo.ClassName;

	}
});
