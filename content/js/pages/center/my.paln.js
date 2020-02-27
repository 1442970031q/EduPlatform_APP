var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'form': {
            'pageIndex': 1,
            'pageSize': 15
        },
        'isLoading':true,
        'pageModel':[],
        'isLoadMore': false,
        'isLoadComplete': false
    },
    methods: {
        'loadingPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PersonalizedTasksList',
                data:this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue,'pageModel',result.Data);
                    _vue.isLoading=false;
                }
            });
        },
        'overNumberDay':function(item){
            var begin=new Date(item.BeginDate).getTime();
            var end=new Date(item.EndDate).getTime();
            var result=end-begin;
            var date=result/1000/60/60/24;
            return date;
        },
        'loadMore': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'PersonalizedTasksList',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel = _vue.pageModel.concat(result.Data);
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
        },
        'gotoPalnDetail':function(item){
            APP.GLOBAL.gotoNewWindow('my.paln.detail',{
                param:'id='+item.Id
            })
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
        this.loadingPageData();
        window.scrollBottom = this.scrollBottom;
    }
});