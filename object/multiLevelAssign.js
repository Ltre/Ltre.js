/**
 * ����༶keyһ����ֵ
 * @params ��1��(n-1)��������key��ǳ�����г�
 * @param ��n������ΪҪ������������ֵ
 * @example
 *      var o = {};
 *      o.multiLevelAssign('a', 'b', 123456); // {a:{b:123456}}
 */
Object.prototype.multiLevelAssign = function(){
    debugger;
    if (arguments.length < 2) throw new Error('args are error, it must be used as multiLevelAssign(key1, [key2,...,keyn,] value)');
    var value = arguments[arguments.length - 1];
    var keys = Array.prototype.slice.call(arguments, 0, -1);
    var curr = this;
    keys.forEach(function(e, i, arr){
        if (i == arr.length - 1) {
            curr[e] = value;
        } else if (!(e in curr) || typeof curr[e] != 'object') {
            curr[e] = {};
        }
        curr = curr[e];
    });
}