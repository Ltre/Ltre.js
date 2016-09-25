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

exports.ltreDeCrypt = ltreDeCrypt;