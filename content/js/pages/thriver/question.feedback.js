var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'pageModel': {
			'feedbackData': JSON.parse(APP.GLOBAL.getItem('question_feedback')),
			'radio': '1',
		},
		'form': {
			'ty': '',
			'cId': '',
			'tqId': '',
			'errorTypeName': '答案有错',
			'errorContent': ''
		}
	},
	methods: {
		'doSubmitAjax': function() {
			this.form.errorTypeName = this.getQuestionSelect();
			APP.GLOBAL.toastLoading('正在提交');

			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'SubTestQuestionsCorrection',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}

					_vue.$toast.success('提交成功');
					setTimeout(function() {
						APP.GLOBAL.closeWindow();
						APP.GLOBAL.removeItem('question_feedback');
					}, 500)
				}
			});
		},
		'getQuestionSelect': function() {
			switch (this.pageModel.radio) {
				case '1':
					return '答案有错';
				case '2':
					return '问题有错';
				case '3':
					return '答案问题不符合';
			}
		},
		'removeQuestionFeedbackItem': function() {
			APP.GLOBAL.removeItem('question_feedback');
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
			this.statusbarHeight = plus.navigator.getStatusbarHeight();
		}
		this.form.ty = this.pageModel.feedbackData.ty;
		this.form.tqId = this.pageModel.feedbackData.tqId;
		this.form.cId = this.pageModel.feedbackData.cId;
	}
});
