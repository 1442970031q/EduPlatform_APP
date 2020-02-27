var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'startTimeShow': false,
		'timeShow': false,
		'currentDate': new Date(),
		'minDate': new Date(),
		'columns': [{
			'time': '5分钟',
			'number': 5
		}, {
			'time': '10分钟',
			'number': 10
		}, {
			'time': '15分钟',
			'number': 15
		}, {
			'time': '20分钟',
			'number': 20
		}, {
			'time': '30分钟',
			'number': 30
		}],
		'testTime': '未选择',
		'minutes': '未选择',
		'form': {
			'tpId': APP.GLOBAL.queryString('tId'),
			'testTime': '',
			'minutes': '',
		}
	},
	methods: {
		'formatter': function(type, value) {
			if (type === 'year') {
				return value + '年';
			} else if (type === 'month') {
				return value + '月';
			} else if (type === 'day') {
				return  value + '日';
			} else if (type === 'hour') {
				return value + '时';
			} else if (type === 'minute') {
				return value + '分';
			}
			return value;
		},
		'choseSatartTime': function(item) {
			this.testTime = item.getFullYear() + '-' + (item.getMonth() + 1) + '-' + item.getDate()   + ' ' + (item.getHours()) +
				':' + item.getMinutes();
			this.form.testTime = this.testTime;
			this.startTimeShow = false;
		},
		'choseTime': function(item) {
			this.minutes = item.time;
			this.form.minutes = item.number;
			this.timeShow = false;
		},
		'submitDataAjax': function() {
			APP.GLOBAL.toastLoading({
				'message': '正在提交'
			})

			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'NewStuWordTest',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading()
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
					}
					_vue.$toast.success('提交成功');
					 setTimeout(function(){
						 APP.GLOBAL.closeWindow()
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
