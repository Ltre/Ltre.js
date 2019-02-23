// node O0o-guard-test.js --codefile=/path/to/jscode.js
// 生成的代码类似于 window._$_$_ = "oo0000oOoo0oo00Ooo00o0oOooo00o0Oooo0o00Oo0o000Ooo000oOoo00o0Ooo00ooOo0o00oOooo0oo";
// 引入 O0o-runtime2.prod.js 后即可执行
const fs = require('fs');
const O0oGuard2 = require('../O0oGuard2');
const argv = require('optimist').argv;

var code = fs.readFileSync(argv.codefile || 'mycode.js', 'utf8');
console.log(O0oGuard2(code));