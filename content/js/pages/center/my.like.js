var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'checked': true,
		'pageModel':[{
			'Name':'ZIIIRO手表',
			'ImgSrc':'../../content/img/default/product_bg1.jpg',
			'Introduce':'这只手表表盘上指针被两条彩色的漩涡所代替，从头部到尾部逐渐由明变暗，里面那条始端代表时钟，外面那条始端则代表分钟。时间随着鲜艳的色彩缓缓流动，诠释了时间的流逝，视觉效果非常出众。没有指针和数字符号，极简主义概念型设计让科技效果尽显。',
			'Price':'1658'
		},{
			'Name':'5克拉钻石戒指女豪华皇冠群镶副钻',
			'ImgSrc':'../../content/img/default/product_bg2.jpg',
			'Introduce':'宝贝很漂亮的超级闪，质量很好，做工非常精细，包装特别精致，超级豪华，圈口大小合适，戴着很合适，非常精美，时尚百搭，很满意。',
			'Price':'1658'
		}]
    },
    methods: {},
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    }
});