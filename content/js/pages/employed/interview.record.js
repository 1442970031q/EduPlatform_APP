var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'form': {
			'name': '',
			'class': '',
			'specialtyDirection': '',
			'phone': '',
			'companyName': '',
			'companyAddress': '',
			'companyContacts': '',
			'contactsPhone': '',
			'interviewPosition': '',
            'interviewTime': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			'companyType': '',
			'interviewSalary': '',
			'technicalIssues': '',
			'personnelIssues': '',
			'hire': '',
			'interviewPromote': '',
			'interviewSelfEvaluate': '暂无',
			'interviewSelfEvaluateNum': '',
			'feel': '',
		},
		'technicalIssues': {
			't1': '',
			't2': '',
			't3': '',
			't4': ''
		},
		'personnelIssues': {
			'p1': '',
			'p2': '',
			'p3': '',
			'p4': ''
		},
		'interviewPromote': [],
        'time': new Date(),
        'minDate': new Date((new Date().getFullYear() - 2), 00, 01),
        'maxDate': new Date(),
		'show': false
	},
	methods: {
		'checkOutForm': function() {
			if (!this.form.specialtyDirection) {
				APP.GLOBAL.toastMsg('专业方向未填写');
				return;
			} else if (!this.form.phone) {
				APP.GLOBAL.toastMsg('手机号码未填写');
				return;
			} else if (this.form.phone.length != 11) {
				APP.GLOBAL.toastMsg('手机号码不足11位');
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
				APP.GLOBAL.toastMsg('联系人电话不足11位');
				return;
			} else if (!this.form.interviewPosition) {
				APP.GLOBAL.toastMsg('面试岗位未填写');
				return;
			} else if (!this.form.interviewTime) {
				APP.GLOBAL.toastMsg('面试时间未填写');
				return;
			} else if (!this.form.companyType) {
				APP.GLOBAL.toastMsg('面试公司类型未填写');
				return;
			} else if (!this.form.interviewSalary) {
				APP.GLOBAL.toastMsg('面试薪资未填写');
				return;
			} else if (!this.stringFormat(this.technicalIssues)) {
				APP.GLOBAL.toastMsg('面试技术问题填写不足两条');
				return;
			} else if (!this.stringFormat(this.personnelIssues)) {
				APP.GLOBAL.toastMsg('人事面试问题填写不足两条');
				return;
			} else if (!this.form.hire) {
				APP.GLOBAL.toastMsg('是否被录用未选择');
				return;
			} else if (this.interviewPromote.length.length < 0) {
				APP.GLOBAL.toastMsg('面试需要提升的地方未选择');
				return;
			} else if (!this.form.interviewSelfEvaluateNum) {
				APP.GLOBAL.toastMsg('面试自我评价未选择');
				return;
			} else if (!this.form.feel) {
				APP.GLOBAL.toastMsg('面试感受未填写');
				return;
			} else {
				this.form.technicalIssues = this.stringFormat(this.technicalIssues);
				this.form.personnelIssues = this.stringFormat(this.personnelIssues);
				this.form.interviewPromote = this.stringFormat(this.interviewPromote);
				this.form.interviewSelfEvaluate = this.form.interviewSelfEvaluate.substr(0, 11);
				this.submitDataAjax();
			}

		},
		'submitDataAjax': function() {
			APP.GLOBAL.toastLoading({
				'message': '正在提交'
			});
			
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'NewInterviewRegistration',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					
					_vue.$toast.success('提交成功');
					APP.GLOBAL.closeWindow();
				}
			});
		},
		'stringFormat': function(string) {
			var str = '';
			var num = 0;
			for (var key in string) {
				if (string[key]) {
					num += 1;
					str += string[key] + '|';
				}
			}
			
			if (string instanceof Array) {
				return str.substr(0, str.length - 1)
			} else if (num < 2) {
				return false;
			}

			return str.substr(0, str.length - 1);
		},
		'confirm': function(value) {
			this.form.interviewTime=value.getFullYear()+'-'+(value.getMonth()+1)+'-'+value.getDate();
			this.show=false;
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
