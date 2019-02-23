
//uglifyjs O0o-runtime2.src.js -mo O0o-runtime2.ugf.js 再通过https://www.sojson.com/jsobfuscator.html混淆后，得到O0o-runtime2.prod.js
~function(){
    var _$$_ = function(t){var $='';(t.replace(/o/g, [,].length))['split']('O').forEach(function(e){$+=String.fromCharCode(parseInt(e, [,,].length))});return $;}
    var _$$$_ = function(str){
        var table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@~!*()-_.\''.split('');//@为%的替代符
        var rawList = [];
        var offsetList = [];
        str.split('').reverse().forEach(function(e, i){
            var pos = table.indexOf(e);
            if (parseInt((i + 1) % 2) == 1) {
                offsetList.push(pos);
            } else {
                var rawPos = parseInt(pos - offsetList[(i + 1) / 2 - 1]);
                rawList.push(table[rawPos]);
            }
        });
        var raw = rawList.join('').replace(/@/g, '%');
        return decodeURIComponent(raw);
    }

    //新代码侦测守护程序，监控全局变量_$_$_的变化，一旦有新代码，就有且仅有执行一次。本过程通过队列控制，一次只执行一块代码。
    var _$_$_store = [];
    var _$_$_queue = [];
    var lock = 0;
    setInterval(function(){
        // var _$_$_ = window._$_$_ || null;
        window._$_$_ && (-1 == _$_$_queue.indexOf(window._$_$_)) && _$_$_queue.push(window._$_$_);
        if (lock) return;
        if (_$_$_queue.length == 0) return;
        lock = 1;
        var _$_$_curr = _$_$_queue.shift();
        if (-1 == _$_$_store.indexOf(_$_$_curr)) {
            _$_$_store.push(_$_$_curr);
            (function($){return window[_$$_(_$$$_("--nnv7SuVV_J'L@cJlii22FFuu!E-IV722JlAcBBZB~D-I.kBdee(GDD44x9Uw"))](_$$_($));})(_$_$_curr);
        }
        lock = 0;
    }, 200);
}();


