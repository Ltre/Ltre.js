window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

Ltrelib.loadScript = function(src, onload, confirmLoad, win) {
    if ('string' != typeof src || ! src.match(/^(https?\:)?\/\/\w+\./))
    onload = 'function' == typeof onload ? onload : function(win){};
    confirmLoad = 'function' == typeof confirmLoad ? confirmLoad : function(win){return true;};
    win = win || window;
    if (! confirmLoad(win)) {
	    var doc = win.document;
		var je = doc.createElement("script"); 
		je.setAttribute("type", "text/javascript"); 
		je.setAttribute("src", src);
		var heads = doc.getElementsByTagName("head"); 
		if (heads.length) {
			heads[0].appendChild(je);
		} else {
			doc.documentElement.appendChild(je);
		}
    }
	var iv = setInterval(function(){
        confirmLoad(win) && ! function(){
            clearInterval(iv);
            if ('function' == typeof onload) {
                onload(win);
            }
        }();
    }, 10);
};

/*
    Usage:
    loadScript('https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js', function(win){
        console.log($);
    }, function(win){
        return 'jQuery' in win;
    }, window);
*/