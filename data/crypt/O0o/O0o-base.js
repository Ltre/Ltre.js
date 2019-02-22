function O0o(s){
    var $ = [];
    s.split('').forEach(function(e){
        $.push(e.charCodeAt().toString(2).replace(/1/g, 'o'));
    });
    return $.join('O');
}
//O0o('这是明文') => o000oooooo0oo00oOoo00oo000o0ooooOoo00oo00000ooo0Ooo00o0oo0000ooo

function o0O(ss){
    var $ = '';
    (t.replace(/o/g, [,].length))['split']('O').forEach(function(e){$+=String.fromCharCode(parseInt(e, [,,].length))});
    return $;
}
//o0O('o000oooooo0oo00oOoo00oo000o0ooooOoo00oo00000ooo0Ooo00o0oo0000ooo') => 这是明文