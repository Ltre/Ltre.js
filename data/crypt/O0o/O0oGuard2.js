

module.exports = function O0oGuard2(s){
    var $ = [];
    s.split('').forEach(function(e){
        $.push(e.charCodeAt().toString(2).replace(/1/g, 'o'));
    });
    return 'window._$_$_ = "' + $.join('O') + '";';
}



// 示例：
// var code = 'alert(123);';
// O0oGuard2(code);
/**

生成代码：


 */
// 执行后生成的代码，需要引入O0o-runtime.js才能运行
