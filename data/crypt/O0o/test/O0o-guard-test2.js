// node O0o-guard-test.js

const fs = require('fs');
const O0oGuard2 = require('../O0oGuard2');

var code = fs.readFileSync('mycode.js', 'utf8');
console.log(O0oGuard2(code));