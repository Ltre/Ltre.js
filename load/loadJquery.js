function loadJquery(win, onload){
    if (win.jQuery) {
	    var doc = win.document;
		var je = doc.createElement("script"); 
		je.setAttribute("type", "text/javascript"); 
		je.setAttribute("src", "//cdn.bootcss.com/jquery/2.1.4/jquery.min.js");
		var heads = doc.getElementsByTagName("head"); 
		if (heads.length) {
			heads[0].appendChild(je);
		} else {
			doc.documentElement.appendChild(je);
		}
    }
	var iv = setInterval(function(){
        win.jQuery && ! function(){
            clearInterval(iv);
            if ('function' == typeof onload) {
                win.jQuery(function(){
                    onload(win.jQuery);
                });
            }
        }();
    }, 10);
}