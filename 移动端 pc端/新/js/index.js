~function ($) {
    function direction(pageX, pageY) {
        var $o = $(this).offset(),
            $w = $(this).outerWidth(),
            $h = $(this).outerHeight();
        var $x = (pageX - $o.left - ($w / 2)) * ($w > $h ? ($h / $w) : 1);
        var $y = (pageY - $o.top - ($h / 2)) * ($h > $w ? ($w / $h) : 1);
        return Math.round((((Math.atan2($y, $x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    }
    function mouseAnimate(interval) {
        interval = interval || 200;
        $(this).on("mouseenter mouseleave", function (e) {
            var $hotInfo = $(this).children(".hotInfo"), $posL = 0, $posT = 0, $tarL = 0, $tarT = 0, $dir = direction.call(this, e.pageX, e.pageY);
            if (e.type === "mouseenter") {
                $dir === 0 ? $posT = "-100%" : null;
                $dir === 1 ? $posL = "100%" : null;
                $dir === 2 ? $posT = "100%" : null;
                $dir === 3 ? $posL = "-100%" : null;
                $hotInfo.css({top: $posT, left: $posL, display: "block"}).stop().animate({
                    top: $tarT,
                    left: $tarL
                }, interval);
                return;
            }
            $dir === 0 ? $tarT = "-100%" : null;
            $dir === 1 ? $tarL = "100%" : null;
            $dir === 2 ? $tarT = "100%" : null;
            $dir === 3 ? $tarL = "-100%" : null;
            $hotInfo.stop().animate({top: $tarT, left: $tarL}, interval, function () {
                $hotInfo.css({
                    display: "none"
                });
            });
        });
    }

    $.fn.extend({mouseAnimate: mouseAnimate});
}(jQuery);

$(".thumbs li a").mouseAnimate(300);
function getCss(attr) {
    var val = null, reg = null;
    if ("getComputedStyle" in window) {
        val = window.getComputedStyle(this, null)[attr];
    } else {
        if (attr === 'opacity') {
            val = this.currentStyle.filter;
            reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            val = this.currentStyle[attr];
        }
    }
    reg = /^-?(\d|[1-9]\d+)(\.\d+)?(px|pt|em|rem)?$/;
    return reg.test(val) ? parseFloat(val) : val;
}

function setCss(attr, value) {
    if (attr === 'float') {
        this.style.cssFloat = value;
        this.style.styleFloat = value;
        return;
    }
    if (attr === 'opacity') {
        this.style.opacity = value;
        this.style.filter = 'alpha(opacity=' + value * 100 + ')';
        return;
    }
    var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Right|Bottom|Left)?))$/;
    if (reg.test(attr)) {
        if (!isNaN(value)) {
            value += 'px';
        }
    }
    this.style[attr] = value;
}

function setGroupCss(options) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            setCss.call(this, key, options[key]);
        }
    }
}
function css(curEle) {
    var argTwo = arguments[1], ary = Array.prototype.slice.call(arguments, 1);
    if (typeof argTwo === 'string') {
        if (typeof arguments[2] === 'undefined') {
            return getCss.apply(curEle, ary);
        }
        setCss.apply(curEle, ary);
    }
    argTwo = argTwo || 0;
    if (argTwo.toString() === '[object Object]') {
        setGroupCss.apply(curEle, ary);
    }
}
~function () {
    function linear(t, b, c, d) {
        return t / d * c + b;
    }

    function move(curEle, target, duration, callBack) {
        var begin = {}, change = {};
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = css(curEle, key);
                change[key] = target[key] - begin[key];
            }
        }
        var time = null;
        clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function () {
            time += 10;
            if (time >= duration) {
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        css(curEle, key, target[key]);
                    }
                }
                clearInterval(curEle.timer);
                callBack && callBack.call(curEle);
                return;
            }
            for (key in target) {
                if (target.hasOwnProperty(key)) {
                    var cur = linear(time, begin[key], change[key], duration);
                    css(curEle, key, cur);
                }
            }
        }, 10)
    }

    window.animate = move;
}();
~function () {
    var $banner = $('#banner'),
        $bannerBg = $('.bannerBg'),
        $bannerCtrl = $('.bannerCtrl'),
        imgList = $bannerBg[0].getElementsByTagName('img'),
        tipList = $bannerCtrl[0].getElementsByTagName('img'),
        jsonData = null, count = null;
    ~function () {
        var xhr = new XMLHttpRequest;
        xhr.open("get", "json/banner.json?_=" + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
                jsonData = JSON.parse(this.responseText);
                console.log(jsonData);
            }
        };
        xhr.send(null);
    }();
    ~function () {
        var str = '', str2 = '';
        if (jsonData) {
            str2 += '<em></em><ul class="tip">';
            for (var i = 0, len = jsonData.length; i < len; i++) {
                var curData = jsonData[i];
                str += '<li><a href=""><img src="" trueImg="' + curData.img + '"></a></li>';
                if (i == 0) {
                    str2 += '<li><i style="display: none"></i><img src="" alt="" tipImg="' + curData.tipImg + '"></li>';
                } else {
                    str2 += '<li><i></i><img src="" alt="" tipImg="' + curData.tipImg + '"></li>';
                }
            }
            str += '<li><a href=""><img src="" trueImg="' + jsonData[0].img + '"></a></li>';
            str2 += '</ul>'
        }
        $bannerBg.html(str);
        $bannerCtrl.html(str2);
        count = jsonData.length;
    }();
    var bannerEm=$('.bannerCtrl em')[0],
        $bannerI=$('.bannerCtrl i');
    window.setTimeout(lazyImg, 300);
    function lazyImg() {
        for (var i = 0, len = imgList.length; i < len; i++) {
            ~function (i) {
                var curImg = imgList[i],
                    tipImg = tipList[i],
                    oTip = new Image,
                    oImg = new Image;
                tipImg ? oTip.src = tipImg.getAttribute('tipImg') : null;
                oImg.src = curImg.getAttribute('trueImg');
                oImg.onload = function () {
                    curImg.src = this.src;
                    oTip.src ? tipImg.src = oTip.src : null;
                    curImg.style.display = 'block';
                    if (tipImg){
                        tipImg.style.display = 'block';
                        animate(tipImg, {opacity: 1}, 300);
                    }
                    animate(curImg, {opacity: 1}, 300);
                    oImg = null;
                }
            }(i);
        }
    }

    var step = -1, interval = 3000, autoTimer = null;
    autoTimer = setInterval(autoMove, interval);
    function autoMove() {
        if (step >= count) {
            step = 0;
            $bannerBg.css('top', 0);
            $(bannerEm).css('top',0);
            $bannerI.css('display','none').siblings().css('display','block');
        }
        step++;
        $('.bannerCtrl li').eq(step).children('i').css('display','none').parent().siblings().children('i').css('display','block');
        animate($bannerBg[0], {top: -step * 160}, 500);
        if (step==3){
            animate(bannerEm, {top: 0}, 500);
            return;
        }
        animate(bannerEm, {top: step * 55}, 500);
    }

    $banner[0].onmouseover = function () {
        clearInterval(autoTimer);
    };
    $banner[0].onmouseout = function () {
        autoTimer = setInterval(autoMove, interval);
    };
}();