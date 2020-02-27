var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'statusbarHeight': 20,
        'backgroundOpacity': 0,
    },
    methods: {
        'winScroll': function () {
            var scrollTop = (document.body.scrollTop > document.documentElement.scrollTop) ? document.body.scrollTop :
                document.documentElement.scrollTop;
            var rat = scrollTop / 65;
            this.scrollTop = scrollTop;

            if (rat >= 1) {
                this.backgroundOpacity = 1;
            } else {
                this.backgroundOpacity = rat;
            }
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
        window.addEventListener('scroll', this.winScroll);
    }
});