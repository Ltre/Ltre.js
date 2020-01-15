import 'layerSet.js';

var store = {};

var raw = {
    11: {
        product_id: 7,
        spec_id: [1,2],
        product_num: 22
    },
    12: {
        product_id: 8,
        spec_id: [3,4],
        product_num: 33
    },
    13: {
        product_id: 9,
        spec_id: [5,6],
        product_num: 44
    }
};

Object.keys(raw).forEach(function(e, i){
    layerSet(store, raw[e]['spec_id'], {
        product_id: raw[e].product_id,
        product_num: raw[e].product_num
    });
});

console.log(store);