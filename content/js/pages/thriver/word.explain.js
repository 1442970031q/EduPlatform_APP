var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isLoadSound': true,
        'isPlaying': false,
        'statusbarHeight': 20,
        'pageModel': {
            'word': null,
            'list': [],
            'index': 0,
            'isExist': false,
            'chapterName': '',
            'courseName':''
        },
        'player': null
    },
    methods: {
        'previous': function () {
            if (this.pageModel.index <= 0) return;

            this.pageModel.index--;
            var model = this.pageModel.list[this.pageModel.index];
            this.pageModel.word = Object.assign(this.pageModel.word, model);

            this.isLoadSound = true;
            this.player.setStyles({
                'src': 'http://dict.youdao.com/dictvoice?audio=' + this.pageModel.word.Eng + '&type=2'
            });

            this.loadPageData();
        },
        'next': function () {
            if (this.pageModel.index + 1 >= this.pageModel.list.length) return;

            this.pageModel.index++;
            var model = this.pageModel.list[this.pageModel.index];
            this.pageModel.word = Object.assign(this.pageModel.word, model);

            this.isLoadSound = true;
            this.player.setStyles({
                'src': 'http://dict.youdao.com/dictvoice?audio=' + this.pageModel.word.Eng + '&type=2'
            });

            this.loadPageData();
        },
        'playSound': function () {
            if (!this.isPlaying) {
                this.isPlaying = true;

                if (APP.CONFIG.IS_RUNTIME) {
                    this.player.play();
                }
            }
        },
        'addBook': function () {
            APP.GLOBAL.toastLoading('正在加入');

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'AddNewWords',
                data: {
                    'wId': this.pageModel.word.Id
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast.success({
                        'message': '已加入',
                        'duration': 800
                    });
                    _vue.pageModel.isExist = true;
                }
            });
        },
        'loadPageData': function () {
            this.isLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL + 'WordIsInNewWords',
                data: {
                    'wId': this.pageModel.word.Id
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    
                    _vue.pageModel.isExist = result.IsExist;
                    _vue.isLoading = false;

                    if (APP.CONFIG.IS_RUNTIME) {
                        _vue.player = plus.audio.createPlayer({
                            'src': 'http://dict.youdao.com/dictvoice?audio=' + _vue.pageModel.word.Eng + '&type=2'
                        });
                        _vue.player.addEventListener('canplay', _vue.canplay);
                        _vue.player.addEventListener('ended', _vue.ended);
                    }
                }
            });
        },
        'canplay': function () {
            this.isLoadSound = false;
        },
        'ended': function () {
            this.isPlaying = false;
        },
        'toFirstUpper': function (char) {
            return char[0].toUpperCase() + char.substring(1);
        }
    },
    created: function () {
        var jsonObject = null;

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
            jsonObject = plus.webview.currentWebview().paramObject;
        } else {
            jsonObject = JSON.parse(`{"word":{"Id":44,"Eng":"override","Phonetic":"əʊvə'raɪd","Chi":"重写； 推翻"},"courseName":"U_C#进阶2016","list":[{"Id":41,"Eng":"base","Phonetic":"beɪs","Chi":" 基底; 基础；"},{"Id":42,"Eng":"gender","Phonetic":"'dʒendə","Chi":" 性;性别；性"},{"Id":43,"Eng":"hobby","Phonetic":"'hɒbɪ","Chi":" 嗜好; 业余爱"},{"Id":44,"Eng":"override","Phonetic":"əʊvə'raɪd","Chi":"重写； 推翻"},{"Id":45,"Eng":"popularity","Phonetic":"pɒpjʊ'lærətɪ","Chi":"人气"},{"Id":46,"Eng":"private","Phonetic":"ˈpraɪvɪt","Chi":" 私人的，私有"},{"Id":47,"Eng":"protected","Phonetic":"prə'tektɪd","Chi":" 受保护的"},{"Id":48,"Eng":"public","Phonetic":"'pʌblɪk","Chi":" 公众的; 政府"},{"Id":49,"Eng":"salary","Phonetic":"'sæləri","Chi":"工资"},{"Id":50,"Eng":"virtual","Phonetic":"ˈvɜ:tʃuəl","Chi":"虚拟"}],"index":3}`);
        }

        this.pageModel.word = jsonObject.word;
        this.pageModel.list = jsonObject.list;
        this.pageModel.index = jsonObject.index;
        this.pageModel.chapterName = jsonObject.chapterName;
        this.pageModel.courseName = jsonObject.courseName;
    },
    mounted: function () {
        this.loadPageData();
    }
});
