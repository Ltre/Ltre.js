function ltreCrypt(str){    
    var table = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    var v1 = encodeURIComponent(str).replace(/%/g,'').toLowerCase();//encode剔%
    var v2 = [];//插缝算随机
    v1.split("").forEach(function(e, i){
        var randomPos = Math.floor(Math.random()*table.length);
        var plusPos = Math.floor((table.indexOf(e) + randomPos)%table.length);
        v2.push(table[randomPos]);
        v2.push(table[plusPos]);
    });
    var v3 = [];//时间戳遍历随机
    var time = String(+ new Date()).split('');
    v2.forEach(function(e, i){
        var loopTimePos = Math.floor(i % time.length);
        var addNum = parseInt(time[loopTimePos]);
        var newPos = Math.floor((table.indexOf(e) + addNum) % table.length);
        v3.push(table[newPos]);
    });
    v3 = v3.reverse().join('');
    return v3;
}


function ltreDeCrypt(str){
    var v1 = str.split('').reverse();
    var v2 = [];
    v1.forEach(function(e, i){
        
    });
    return '';
}