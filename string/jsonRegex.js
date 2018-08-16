window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突
Ltrelib.string = Ltrelib.string || {};

//支持JSON RFC 4627标准，不支持单引号
Ltrelib.string.jsonRegex = function(jsonText){
    return /^[\],:{}\s]*$/.test(jsonText.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))
};