
module.exports = function O0oGuard2(s){
    var $ = [];
    s.split('').forEach(function(e){
        $.push(e.charCodeAt().toString(2).replace(/1/g, 'o'));
    });
    return 'window._$_$_ = "' + $.join('O') + '";';
}