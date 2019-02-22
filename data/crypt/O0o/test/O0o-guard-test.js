// node O0o-guard-test.js

const fs = require('fs');
const O0oGuard = require('../O0oGuard');

var code = fs.readFileSync('mycode.js', 'utf8');
console.log(O0oGuard(code));