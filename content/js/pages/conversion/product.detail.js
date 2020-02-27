Vue.use(vant.Lazyload, {
    'loading': '../../content/img/thriver/default_video_detail.jpg',
    'error': '../../content/img/thriver/default_video_detail.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'opacityValue': 0,
        'statusbarHeight': 20,
        'number': 1,
        'isLoading': true,
        'pageModel': {}
    },
    methods: {
        'onSubmit': function () {
            if (this.currentUser.YSDCoin < this.pageModel.YCoin) {
                _vue.$toast({
                    'message': '无法兑换！\n您的云币数量不足',
                    'icon': '../../content/img/conversion/product_detail_bg.png'
                });
                return;
            }
            APP.GLOBAL.confirmMsg({
                'title': '购买确认',
                'message': '<p>你将花费 ' + numberFormat(this.pageModel.YCoin * this.number, 2) + ' 云币</p><p>是否购买该产品？</p>',
                'confirmCallback': this.doSubmitAjax,
                'confirmButtonText': '确认购买',
                'cancelButtonText':'取消'
            });
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading('正在购买');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'BuyGoods',
                data: {
                    'id': APP.GLOBAL.queryString('pId'),
                    'count': this.number
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        _vue.$toast({
                            'message': '兑换失败！\n您的云币数量不足',
                            'icon': '../../content/img/conversion/product_detail_bg.png'
                        });
                        return;
                    }

                    APP.GLOBAL.updateUserModel({
                        'YSDCoin': result.YCoin
                    }, [{
                        'pageName': 'center.htmlPage',
                        'actionName': '_vue.updatePage()'
                    }]);

                    APP.GLOBAL.gotoNewWindow('conversion.success', {
                        'openCallback': function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GoodsDetail',
                data: {
                    'id': APP.GLOBAL.queryString('pId')
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModel', result.Data);
                    _vue.isLoading = false;
                }
            });
        },
        'filterStyle': function (content) {
            return content.replace(/\s+style="[^"]*"/gi, '');
        },
        'scrollChange': function (top) {
            if (top === 0) {
                this.opacityValue = 0;
                return;
            }

            this.opacityValue = top / (this.statusbarHeight + 45);
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        window.scrollChange = this.scrollChange;
    },
    computed: {
        'totalPrice': function () {
            return this.pageModel.YCoin * this.number * 100;
        }
    },
    mounted: function () {
        this.loadPageData();
 
    }
});
