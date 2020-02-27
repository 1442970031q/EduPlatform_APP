var _vue = new Vue({
	el: '#app',
	data: {
		'currentUser': APP.GLOBAL.getUserModel(),
		'statusbarHeight': 20,
		'pageModule': {
            'one': {},
			'two': []
        },
        'request': {
            'type': APP.GLOBAL.queryString('type')  
        },
		'form': {
			'aId': '',
			'lessonName': '',
			'segNum': '',
			'sId': '',
			'state': '',
			'remarks': ''
		},
		'index': '',
        'show': false,
        'lesson': null,
        'studnet': null
	},
	methods: {
		'sigin': function(item, index) {
			if (this.lesson !== '') {
				this.form.sId = item.Id;
			}
			if (this.studnet !== '') {
				this.form.sId = item.StudentId;
			}

			this.form.state = 1;
			this.index = index;
            this.submitAjax(true);
		},
		'submitAjax': function(isAmend) {
			APP.GLOBAL.toastLoading({
				'message': '正在提交'
            });
            
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'RegistrationPublicLessonsStuAttendance',
				data: this.form,
				success: function(result) {
					APP.GLOBAL.closeToastLoading();
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
                    }

					if (_vue.lesson !== null) {
						_vue.pageModule.one[_vue.index].State = _vue.form.state;
                        _vue.form.aId = result.Id;
                    }
                     
					if (_vue.studnet !== '') {
						_vue.pageModule.two.Data[_vue.index].State = _vue.form.state;
                    }

					if (isAmend === true) {
						_vue.pageModule.two.Data[_vue.index].IsModified = true;
                    }

					var wb = plus.webview.getWebviewById('public.crouse.checkPage');
					wb.evalJS('_vue.loadingPageData()');
				}
			});
		},
		'amendCallBack': function(obj) {
			this.form.state = obj.state;
			this.form.remarks = obj.remek;
			if (obj.isAmend) {
				this.submitAjax(obj.isAmend);
			} else {
				this.submitAjax(false);
			}

		},
		'gotoAmend': function(item, index, t) {
			this.form.sId = typeof item.Id !== 'undefined' ? item.Id : item.StudentId;
			this.index = index;
            var obj = {
                title: t === 1 ? '修改考勤' : '其它',
                segNum: this.form.segNum,
                name: typeof item.RealName !== 'undefined' ? item.RealName : item.StudentName,
                nowstate: item.State,
                remarks: item.Remarks
            };

			APP.GLOBAL.gotoNewWindow('public.crouse.check.amend', {
				param: 'obj=' + JSON.stringify(obj)
			});
		},
		'loadingPageDataStudnet': function() {
			APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL + 'GetClassStudentList',
				success: function(result) {
					if (result.Error) {
						APP.GLOBAL.toastMsg(result.Msg);
						return;
                    }

					var obj = new Array();
                    result.StudentsList.forEach(function (item, index) {
                        obj[index] = {
                            Id: item.Id,
                            RealName: item.RealName,
                            State: 0,
                            IsModified: false
                        };
                    });
                    _vue.pageModule.one = obj;
				}
			});
		}
	},
	created: function() {
		if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();

            var wb = plus.webview.currentWebview();
            if (this.request.type === '2') {
                this.lesson = wb.paramObject;
                this.form.lessonName = this.lesson.name;
                this.form.segNum = this.lesson.time;
                this.loadingPageDataStudnet();
            }else if (this.request.type === '1') {
                this.studnet = wb.paramObject;
                this.form.aId = this.studnet.AttendanceId;
                this.form.segNum = this.studnet.SegNum;
                this.form.lessonName = this.studnet.LessonName;
                Vue.set(this.pageModule, 'two', this.studnet);
                this.show = true;
            }
        }
	}
});
