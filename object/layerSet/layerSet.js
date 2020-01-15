/**
 * 多维对象一键赋值
 * @param store 保存在外部的对象
 * @param keys 从左到右顺序表示的键名数组，如['a', 'b', 'c']，意为 obj.a.b.c
 * @param data 设置的数据，效果如 obj.a.b.c = data
 * @return 结果
 */
function layerSet(store, keys, data){
    store = store || {};
    var tmp = {};
    for (var i in keys) {
        var k = keys[i];
        if (! (k in tmp)) {
            tmp[k] = {};
        }
        if (i == keys.length - 1) {
            tmp[k] = data;
        }
        if (i == 0) store[k] = tmp[k];
        tmp = tmp[k];
    }
    return store;
}