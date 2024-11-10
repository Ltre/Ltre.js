window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

/**
 * IO控制器
 * @param opt
 * @returns none
 * @example
 *     controlable({
 *         tokenGetter: function(socket){
 *             var token = (location.href.match(/\#.*[?&]?showControlView\=([^&]+)/)||[,-1])[1];
 *             if (-1 === token) {
 *                 token = + new Date();
 *             }
 *             return token;
 *         },
 *         emitor: function(send){
 *             send('shell2', 'This is an value from controller!');//主控端发指令
 *         },
 *         onAccept: function(socket, token, type, value) { //被控端接收指令
 *             alert(value);
 *             switch (type) {
 *                 case 'shell1': 
 *                     alert(1);
 *                     break;
 *                 case 'shell2':
 *                     alert(2);
 *                     break;
 *                 default:
 *                     alert('default');
 *             }
 *         },
 *         initializer: function(socket, token) { //用于生成主控端访问方式
 *             var c = document.getElementById('controller');
 *             var h = location.href + '#showControlView=' + token;
 *             c.innerText = h;
 *             c.href = h;
 *         }
 *     });
 */
Ltrelib.controlable = function(opt) {

    var loadToLoad = function(cb) {
        var e = document.createElement('script');
        e.setAttribute('type', 'text/javascript');
        e.setAttribute('src', '//res.miku.us/res/js/loadScript.js');
        document.body.appendChild(e);
        var iv = setInterval(function(){
            if ('Ltrelib' in window && 'loadScript' in window.Ltrelib) {
                clearInterval(iv);
                if (typeof cb == 'function') {
                    cb.call(this, window.Ltrelib.loadScript);
                }
            }
        }, 100);
    };

    loadToLoad(function(loadScript){
        loadScript('//res.miku.us/res/js/socket.io.min.js', function(){
                var socket = io.connect('https://io.miku.us:3000');
                var localToken = opt.tokenGetter(socket);

                socket.emit('ctrl/regCmd', localToken);
                socket.on('ctrl/acceptCmd', function(rToken, type, value){
                    if (localToken == rToken) {
                        opt.onAccept(socket, localToken, type, value);
                    }
                });

                opt.initializer(socket, localToken);

                opt.emitor(function(type, value){
                    socket.emit('ctrl/sendCmd', localToken, type, value);
                });
        }, function(win){ return 'io' in win; });
    });
};