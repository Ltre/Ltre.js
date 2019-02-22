module.exports = function O0oGuard(code){
    var c = '_$_$_("" ';
    code.split('').forEach(function(e){
        var n = e.charCodeAt();
        c += '+$S5s(';
        var na = [];
        (n + '').split('').reverse().forEach(function(ee, i){
            var nV = parseInt(ee) ? '_'+'$'.repeat(ee) : 0;//数字变量
            var tV = Math.pow(10, i);//1, 10, 100, ...
            // console.log({e:e, ee:ee, nV:nV, tV:tV, c:c, n:n, na:na});
            na.push(nV + '*' + tV);
        });
        c += na.join('+');
        c += ')';
    });
    c += ');'
    return c;
}

// 示例：
// var code = 'alert(123);';
// O0oGuard(code);
/**

生成代码：
_$_$_("" +$S5s(_$$$$$$$*1+_$$$$$$$$$*10)+$S5s(_$$$$$$$$*1+0*10+_$*100)+$S5s(_$*1+0*10+_$*100)+$S5s(_$$$$*1+_$*10+_$*100)+$S5s(_$$$$$$*1+_$*10+_$*100)+$S5s(0*1+_$$$$*10)+$S5s(_$$$$$$$$$*1+_$$$$*10)+$S5s(0*1+_$$$$$*10)+$S5s(_$*1+_$$$$$*10)+$S5s(_$*1+_$$$$*10)+$S5s(_$$$$$$$$$*1+_$$$$$*10));

 */
// 执行后生成的代码，需要引入O0o-runtime.js才能运行
