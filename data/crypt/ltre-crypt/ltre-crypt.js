function ltreCrypt(str){    
    var table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@~!*()-_.\''.split('');//@为%的替代符
    var v1 = encodeURIComponent(str).replace(/%/g,'@');//encode替%
    var v2 = [];//插缝算随机
    v1.split("").forEach(function(e, i){
        var rawPos = table.indexOf(e);
        var offset = Math.floor(Math.random()*(table.length-rawPos));
        var plusPos = rawPos + offset;
        v2.push(table[offset]);//此步密钥
        v2.push(table[plusPos]);
    });
    v2 = v2.reverse().join('');
    return v2;
}


function ltreDeCrypt(str){
    var table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@~!*()-_.\''.split('');//@为%的替代符
    var rawList = [];
    var offsetList = [];
    str.split('').reverse().forEach(function(e, i){
        var pos = table.indexOf(e);
        if (parseInt((i + 1) % 2) == 1) {
            offsetList.push(pos);
        } else {
            var rawPos = parseInt(pos - offsetList[(i + 1) / 2 - 1]);
            rawList.push(table[rawPos]);
        }
    });
    var raw = rawList.join('').replace(/@/g, '%');
    return decodeURIComponent(raw);
}
