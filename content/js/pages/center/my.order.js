Vue.use(vant.Lazyload, {
    'error': '../../content/img/conversion/default_conversion_block.jpg',
    'loading': '../../content/img/conversion/default_conversion_block.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'tabIndex': 0,
        'tabPages': [
            {
                'name': '全部',
                'pageIndex': 1,
                'pageSize': 15,
                'state': '',
                'list': [],
                'isLoadMore': false,
                'isLoadComplete': false,
                'isLoading': true,
                'isLoaded': true
            },
            {
                'name': '已申请',
                'pageIndex': 1,
                'pageSize': 15,
                'state': '1',
                'list': [],
                'isLoadMore': false,
                'isLoadComplete': false,
                'isLoading': true,
                'isLoaded': false
            },
            {
                'name': '待取货',
                'pageIndex': 1,
                'pageSize': 15,
                'state': '2',
                'list': [],
                'isLoadMore': false,
                'isLoadComplete': false,
                'isLoading': true,
                'isLoaded': false
            },
            {
                'name': '已收货',
                'pageIndex': 1,
                'pageSize': 15,
                'state': '3',
                'list': [],
                'isLoadMore': false,
                'isLoadComplete': false,
                'isLoading': true,
                'isLoaded': false
            }
        ]
    },
    methods: {
        'loadPageData': function () {
            var tab = this.tabPages[this.tabIndex];

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GoodsOrderList',
                data: {
                    'pageIndex': tab.pageIndex,
                    'pageSize': tab.pageSize,
                    'state': tab.state
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(tab, 'list', result.Data);
                    tab.pageIndex++;
                    tab.isLoading = false;
                }
            });
        },
        'tabChanged': function (index) {
            var tab = this.tabPages[index];
            if (!tab.isLoaded) {
                tab.isLoaded = true;
                this.loadPageData();
            }
        },
        'loadMoreAjax': function () {
            var tab = this.tabPages[this.tabIndex];

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'GoodsOrderList',
                data: {
                    'pageIndex': tab.pageIndex,
                    'pageSize': tab.pageSize,
                    'state': tab.state
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tab.pageIndex++;
                    tab.list = tab.list.concat(result.Data);
                    tab.isLoadMore = false;

                    if (result.Data.length < tab.pageSize) {
                        tab.isLoadComplete = true;
                    }
                }
            });
        },
        'scrollBottom': function (scroll) {
            var tab = this.tabPages[this.tabIndex];

            if (!tab.isLoadMore && !tab.isLoadComplete && scroll !== 0) {
                tab.isLoadMore = true;
                this.loadMoreAjax();
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        var requestIndex = APP.GLOBAL.queryString('tIndex');
        this.tabIndex = requestIndex ? requestIndex * 1 : 0;
        if (this.tabIndex !== 0) {
            this.tabPages[this.tabIndex].isLoaded = true;
            this.tabPages[0].isLoaded = false;
        }

        this.loadPageData();
        window.scrollBottom = this.scrollBottom;
    }
});