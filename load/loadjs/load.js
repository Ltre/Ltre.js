window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

Ltrelib.load = function(win, jslist, onload){
    win.Ltrelib || (win.Ltrelib = {});
    var loadScript = function(src){
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
    };
    for (var i in jslist) {
        if ('string' == typeof jslist[i] && ! Ltrelib[i]) {
            loadScript(jslist[i]);
        }
    }
	var iv = setInterval(function(){
        var loaded = true;
        for (var i in jslist) {
            loaded = !!(loaded && Ltrelib[i]);
        }
        loaded && ! function(){
            clearInterval(iv);
            if ('function' == typeof onload) {
                onload(Ltrelib);
            }
        }();
    }, 10);
}

module.exports = Ltrelib.load;