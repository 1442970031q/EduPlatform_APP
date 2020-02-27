var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'isLoading': true,
        'form': {
            'pageIndex': 1,
            'pageSize': 15
        },
        'data': [],
        'isLoadMore': false,
        'isLoadComplete': false
    },
    methods: {
        'loadPageData': function () {
            this.form.pageIndex = 1;
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.data = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('weekly.detail', {
                param: 'wId=' + item.Id
            });
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WeeklyList',
                data: this.form,
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
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});
