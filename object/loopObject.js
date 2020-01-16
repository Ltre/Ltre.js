function loopObject(obj, cb){
    if (typeof obj == 'object') {
        Object.keys(obj).forEach(function(e){
            cb(e, obj[e]);
        })
    }
}

loopObject({a: 1, b: 3, c: 5}, function(i, e){
    console.log({i, e});
})