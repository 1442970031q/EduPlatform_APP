var APP_NAME = 'Student_'; //APP名字
var _openw = null; //当前打开窗体
//var BASE_IP = "47.92.108.219:8102";
var BASE_IP = "api.ysdjypt.com";
var APP = { //APP核心对象
    'CONFIG': {
        'TIME_OUT': 59,
        'VERSION': 26,
        'BASE_URL': 'http://' + BASE_IP + '/StuAPI/',
		//'BASE_URL': 'https://' + BASE_IP + '/StuAPI/',
        'IS_RUNTIME': navigator.userAgent.indexOf("Html5Plus") > -1,
        'SYSTEM_KEYS': {
            'USER_MODEL_KEY': APP_NAME + '_user_model',
            'LOCAL_LOGIN_INFO_KEY': APP_NAME + '_local_login_info',
            'AUTO_LOGIN_KEY': APP_NAME + '_auto_login',
            'TEMP_QUESTION_LIST_KEY': APP_NAME + '_temp_question_list',
            'FIRST_NOTICE_KEY': APP_NAME + '_first_notice'
        },
        'SUB_PAGES': [{
            'pageName': 'dynamics.html',
            'isLoaded': true,
            'loadAction': ''
        }, {
            'pageName': 'thriver.html',
            'isLoaded': false,
            'loadAction': ''
        }, {
            'pageName': 'employed.html',
            'isLoaded': false,
            'loadAction': ''
        }, {
            'pageName': 'center.html',
            'isLoaded': false,
            'loadAction': ''
        }],
        'IPHONE': {
            // iPhone X、iPhone XS
            isIPhoneX: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812,
            // iPhone XS Max
            isIPhoneXSMax: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896,
            // iPhone XR
            isIPhoneXR: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896,
        },
        'IsSafeArea': function () {
            return APP.CONFIG.IPHONE.isIPhoneX || APP.CONFIG.IPHONE.isIPhoneXSMax || APP.CONFIG.IPHONE.isIPhoneXR;
        },
        'TOAST_DEFAULT': {
            mask: true,
            message: '加载中...',
            duration: 0,
            forbidClick: true
        },
        'CONFIRM_DEFAULT': {
            title: '确认对话框',
            message: '确认对话框内容',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            confirmCallback: function () { },
            cancelCallback: function () { }
        },
        'SYSTEM_NAME': function () {
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                return 'ios';
            } else {
                return 'andr';
            }
        }()
    },
    'GLOBAL': {
        'getItem': function (key) {
            if (APP.CONFIG.IS_RUNTIME) {
                return plus.storage.getItem(key);
            } else {
                return window.localStorage.getItem(key);
            }
        },
        'setItem': function (k, v) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.setItem(k, v);
            } else {
                window.localStorage.setItem(k, v);
            }
        },
        'removeItem': function (key) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.removeItem(key);
            } else {
                window.localStorage.removeItem(key);
            }
        },
        'getUserModel': function () {
            var jsonText = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            if (jsonText === null) {
                return APP.USER.MODEL;
            }

            APP.USER.MODEL = JSON.parse(jsonText);
            return APP.USER.MODEL;
        },
        'updateUserModel': function (model, pages) {
            APP.USER.MODEL = Object.assign(APP.USER.MODEL, model);
            APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY, JSON.stringify(APP.USER.MODEL));

            if (pages instanceof Array && APP.CONFIG.IS_RUNTIME) {
                for (var i = 0; i < pages.length; i++) {
                    var wb = plus.webview.getWebviewById(pages[i].pageName);
                    wb.evalJS(pages[i].actionName);
                }
            }
        },
        'removeModel': function () {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.removeItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            } else {
                window.localStorage.removeItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            }

            APP.USER.MODEL = {
                'Id': 0,
                'Key': ''
            };
        },
        'gotoNewWindow': function (page, an) {
            var _newWindow = function newWindow(page, ext) {
                var index = page.lastIndexOf('/');
                var pageId = index === -1 ? page : page.substring(index + 1);
                pageId = pageId + 'Page';

                if (_openw === null) {
                    ext = typeof ext !== 'object' ? {} : ext;
                    _openw = plus.webview.create(page + (ext.param ? '.html?' + ext.param : '.html'), pageId, {
                        scrollIndicator: 'none',
                        scalable: false,
                        popGesture: ext.popGesture,
                        kernel: 'WKWebview',
                        contentAjust: false,
                        titleNView: ext.titleNView,
                        plusrequire: 'ahead',
                        softinputMode: ext.softinputMode
                    }, { 'paramObject': ext.paramObject });

                    var ani = ext.ani || 'pop-in';
                    _openw.addEventListener('loaded', function () {
                        _openw.show(ani, 250, function () {
                            if (typeof ext.openCallback === 'function') {
                                ext.openCallback();
                            }
                        });
                    });

                    _openw.addEventListener('close', function () {
                        _openw = null;
                        if (typeof ext.closeCallback === 'function') {
                            ext.closeCallback();
                        }
                    });
                }
            };

            if (APP.CONFIG.IS_RUNTIME) {
                _newWindow(page, {
                    ani: typeof an === 'object' && an.ani ? an.ani : 'pop-in',
                    openCallback: typeof an === 'object' && an.openCallback ? an.openCallback : null,
                    closeCallback: typeof an === 'object' && an.closeCallback ? an.closeCallback : null,
                    'popGesture': typeof an === 'object' && typeof an.popGesture !== 'undefined' ? an.popGesture : 'close',
                    'param': typeof an === 'object' && typeof an.param !== 'undefined' ? an.param : null,
                    'paramObject': typeof an === 'object' && typeof an.paramObject !== 'undefined' ? an.paramObject : null,
                    titleNView: typeof an === 'object' && typeof an.titleNView !== 'undefined' ? an.titleNView : null,
                    'softinputMode': typeof an === 'object' && typeof an.softinputMode !== 'undefined' ? an.softinputMode : 'adjustResize'
                });
            } else {
                if (typeof an !== 'undefined' && typeof an.param !== 'undefined') {
                    window.location = page + '.html?' + an.param;
                } else {
                    window.location = page + '.html';
                }
            }
        },
        'closeWindow': function (ani) {
            if (!APP.CONFIG.IS_RUNTIME) {
                window.history.back();
                return;
            }

            if (typeof window.onPageClose === 'function') {
                window.onPageClose();
                return;
            }

            plus.webview.currentWebview().close(typeof ani === 'string' ? ani : 'auto');
        },
        'showWaiting': function (text) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.nativeUI.showWaiting(text);
            } else {
                APP.GLOBAL.toastLoading({
                    'message': text
                });
            }
        },
        'closeWaiting': function () {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.nativeUI.closeWaiting();
            } else {
                APP.GLOBAL.closeToastLoading();
            }
        },
        'toastLoading': function (option) {
            if (typeof _vue === 'undefined') return;
            if (typeof option === 'string') {
                option = {
                    message: option
                };
            }

            option = Object.assign({}, APP.CONFIG.TOAST_DEFAULT, option);
            _vue.$toast.loading({
                mask: option.mask,
                duration: option.duration,
                message: option.message
            });
        },
        'closeToastLoading': function () {
            if (typeof _vue === 'undefined') return;

            _vue.$toast.clear();
        },
        'toastMsg': function (text) {
            if (!APP.CONFIG.IS_RUNTIME) {
                _vue.$toast({
                    'message': text,
                    'position': 'bottom',
                    'duration': 2500
                });
            } else {
                plus.nativeUI.toast(text);
            }
        },
        'confirmMsg': function (option) {
            option = Object.assign({}, APP.CONFIG.CONFIRM_DEFAULT, option);
            _vue.$dialog.confirm(option).then(option.confirmCallback).catch(option.cancelCallback);
        },
        'queryString': function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);

            if (r !== null) {
                return decodeURIComponent(r[2]);
            }
            return '';
        },
        'gotoLogin': function () {
            if (!APP.CONFIG.IS_RUNTIME) {
                APP.GLOBAL.toastMsg('登录信息失效，请重新登录');
                return;
            }

            if (plus.webview.getWebviewById('loginPage') !== null) return;

            APP.GLOBAL.gotoNewWindow('_www/pages/account/login', {
                ani: 'slide-in-bottom',
                popGesture: 'none',
                param: 'closeonly=true',
                closeCallback: function () {
                    plus.webview.currentWebview().reload();
                }
            });
        },
        'ajax': function (option) {
            var d = new Date();
            var timespan = d.getFullYear() + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes();
            option = option || {};
            option.method = "POST";
            option.url = option.url || '';
            option.dataType = "JSON";
            option.async = option.async || true;
            option.data = option.data || {};
            option.timeout = option.timeout || 15000;
            option.data['key'] = APP.USER.MODEL.Key;
            option.data['v'] = timespan;
            option.success = option.success || function () { };
            option.error = option.error || function (XMLHttpRequest, textStatus, errorThrown) {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }
                console.log('status:' + XMLHttpRequest.status);
                console.log('XMLHttpRequest：' + JSON.stringify(XMLHttpRequest));
                console.log('readyStatetus:' + XMLHttpRequest.readyState);
                console.log('textStatus:' + textStatus);
                console.log('errorThrown:' + errorThrown);
            };

            if (!XMLHttpRequest) {
                console.log("不支持XMLHttpRequest对象。");
                return;
            }

            var xhr = new XMLHttpRequest();
            xhr.ontimeout = option.ontimeout || function () {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }

                APP.GLOBAL.toastMsg('服務器目前繁忙，請稍後重試該操作！');
            };

            if (typeof xhr === 'undefined' || xhr === null) {
                console.log("XMLHttpRequest对象创建失败！");
                return;
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            var json = JSON.parse(xhr.responseText || xhr.response);
                            if (typeof json !== 'undefined' && json.IsLogin === false) {
                                APP.GLOBAL.gotoLogin();
                                return;
                            }

                            option.success(json);
                        } catch (e) {
                            console.error('Response:' + (xhr.responseText || xhr.response) + '\r\nMessage:' + e.message + '\r\nStack:' +
                                e.stack);
                            option.error(xhr, xhr.status);
                        }
                    } else {
                        option.error(xhr, xhr.status);
                    }
                }
            };

            var params = [];
            for (var key in option.data) {
                if (option.data.hasOwnProperty(key)) {
                    params.push(key + '=' + option.data[key]);
                }
            }

            try {
                var postData = params.join('&');
                xhr.open(option.method, option.url, option.async);
                xhr.timeout = option.timeout;
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xhr.send(postData);
            } catch (e) {
                console.log(e);
            }
        }
    },
    'USER': {
        'MODEL': {
            'Key': '',
            'UserInfo': {}
        }
    }
};

//页面加载完毕事件
function pageLoaded() {
    //监听滚动事件
    if (typeof window.scrollChange === 'function' || typeof window.scrollBottom === 'function') {
        window.addEventListener('scroll', function () {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight :
                    document.documentElement.clientHeight;
            } else {
                clientHeight = document.body.clientHeight > document.documentElement.clientHeight ? document.body.clientHeight :
                    document.documentElement.clientHeight;
            }

            var scrollTop = document.body.scrollTop > document.documentElement.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
            var scrollBottom = document.body.scrollHeight - scrollTop;
            if (typeof window.scrollChange === 'function') {
                window.scrollChange(scrollTop);
            }

            if (scrollBottom >= clientHeight && scrollBottom <= clientHeight + 70) {
                if (typeof window.scrollBottom === 'function') window.scrollBottom(scrollTop);
            }
        });
    }

    if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') { //如果安卓则绑定返回按钮事件
        //绑定后退按钮事件（安卓按钮）
        plus.key.addEventListener('backbutton', function () {
            //如果窗体自身实现后退按钮
            if (typeof window.backButton === 'function') {
                window.backButton();
                return; //不再处理其他业务
            }

            //检查是否需要退出app
            if (plus.webview.all().length !== APP.CONFIG.SUB_PAGES.length + 1) {
                APP.GLOBAL.closeWindow();
            } else {
                var mainPage = plus.webview.getWebviewById('mainPage');
                if (mainPage !== null) {
                    mainPage.evalJS('_vue.hiddenApp()');
                }
            }
        });
    }

    //绑定顶部返回按钮事件
    var back = document.getElementById('app-back-button');
    if (back !== null) {
        back.addEventListener('click', APP.GLOBAL.closeWindow);
    }
}

/*
 *   获取第一个检索到的元素
 */
function getFirstByClass(classname) {
    var oChild = document.getElementsByTagName('*');

    for (var i = 0, len = oChild.length; i < len; i++) {
        if (oChild[i].className.toString().indexOf(classname) >= 0) {
            return oChild[i];
        }
    }
    return null;
}

/*
 * 参数说明：
 * @param：要格式化的数字
 * @param：保留几位小数
 * */
function numberFormat(value, digitNum) {
    if (typeof value === 'undefined' || value === null || value === '') {
        return 0;
    }

    var initV = value;
    var seperator = ',';
    if ((value = ((value = (value * 1).toFixed(4) + "").replace(/^\s*|\s*$|,*/g, ''))).match(/^\d*\.?\d*$/) === null)
        return initV;

    var _padLeft = function (len, str) {
        var index = str.indexOf('.');
        if (index === -1) return [str, ''];

        if (len <= 0 && index !== -1) return [str.substr(0, index), ''];
        else if (len <= 0) return [str, ''];

        var arr = str.split('.');
        var count = len - arr[1].length;
        if (count < 0) return [arr[0], arr[1].substr(0, len)];

        for (var i = 0; i < count; i++) {
            arr[1] = arr[1] + '0';
        }

        return [arr[0], arr[1]];
    };

    var newValue = _padLeft(digitNum, value);
    var r = [];
    var tl = newValue[0];
    var tr = newValue[1];

    if (seperator !== null && seperator !== '') {
        while (tl.length >= 3) {
            r.push(tl.substring(tl.length - 3));
            tl = tl.substring(0, tl.length - 3);
        }

        if (tl.length > 0) {
            r.push(tl);
        }

        r.reverse();
        r = r.join(seperator);
        return !tr || tr.length === 0 ? r : r + '.' + tr;
    }
    return value;
}

if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
            "use strict";
            if (target === undefined || target === null)
                throw new TypeError("Cannot convert first argument to object");

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) continue;
                var keysArray = Object.keys(Object(nextSource));

                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                }
            }
            return to;
        }
    });
}

String.prototype.startWith = function (s) {
    if (s === null || s === "" || this.length === 0 || s.length > this.length)
        return false;

    if (this.substr(0, s.length) === s)
        return true;
    else
        return false;
};

//取消浏览器的所有事件，使得active的样式在手机上正常生效
document.addEventListener('touchstart', function () {
    return false;
}, true);
// 禁止选择
//document.oncontextmenu = function () { return false; };

document.addEventListener('DOMContentLoaded', pageLoaded);
