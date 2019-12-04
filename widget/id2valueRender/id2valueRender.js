/**
 * ID => 其它值
 * 
 * 杜绝重复请求，提高渲染效率
 * 
 * 前端依赖：jQuery, LtreLib.timing
 * 接口要求：仅可定义一个ID参数，参数名可自定义
 * 
 * @param {String} sourceSelector 被替换ID所在DOM的JQ选择器，支持选择结果为单项和多项
 * @param {String} apiUrl 通过ID获取数据的接口地址，要求仅可定义一个ID参数，返回结果也为JSON
 * @param {String} idField 请求数据接口用的自定义ID参数名，如“mgrId”
 *      例如: '.mgrId2name'
 * @param {Function} userRender 执行数据替换的渲染过程.
 *      回调参数定义:
 *          that - 选择器（sourceSelector + ':eq(' + i + ')', i为0~n）的JQ对象
 *          j - 接口[/manager/getById]的JSON响应结果
 * @param {Function} userGetIdFromWidget 从DOM获取ID值的过程.
 *      回调参数定义：
 *          that - 选择器（sourceSelector + ':eq(' + i + ')', i为0~n）的JQ对象
 * @returns null
 * 
 * @example
 *      示例1：
 *          new id2valueRender('.mgrId2name');
 *      示例2：
            new id2valueRender('.mgrId2name', '/manager/getById', 'mgrId', function(that, j){
                if (j.rs) {
                    that.text(j.mgr.realname);
                    that.prop('title', "账号="+j.mgr.passport+", ID="+j.mgr.mgr_id);
                } else {
                    that.text('-');
                }
            }, function(that){
                return that.text();
            });
 */
function id2valueRender(sourceSelector, apiUrl, idField, userRender, userGetIdFromWidget){
    var locks = {};
    var cache = {};

    function defaultRender(that, j){
        if (j.rs) {
            that.text(j.mgr.realname);
            that.prop('title', "账号="+j.mgr.passport+", ID="+j.mgr.mgr_id);
        } else {
            that.text('-');
        }
    }

    function defaultGetIdFromWidget(that){
        return that.text();
    }

    function render(that, j){
        (userRender || defaultRender).apply(this, arguments);
    }

    function getIdFromWidget(that){
        return (userGetIdFromWidget || defaultGetIdFromWidget).apply(this, arguments);
    }

    var totalSize = $(sourceSelector).size();
    if (! totalSize) return;

    LtreLib.timing({
        a: 1,
        z: totalSize,
        delay: 30,//建议25～75，视接口响应时间来定
        onTiming: function(opt){
            var that = $(sourceSelector + ':eq(' + (opt.i-1) + ')');
            var id = getIdFromWidget(that);
            if (id in cache) {//后来者，直接享用前人挖井成果
                render(that, cache[id]);
            } else {
                if (! (id in locks) || ! locks[id]) {//第一个挖井人
                    locks[id] = 1;

                    var param = {};
                    param[idField || 'mgrId'] = id;
                    $.get(
                        apiUrl || '/manager/getById', 
                        param,
                        function(j){
                            locks[id] = 0;
                            cache[id] = j;
                            render(that, j);
                        }, 
                        'jsonp'
                    );
                } else {//后来者，等待前人挖井成果
                    var iv = setInterval(function(){
                        if (id in cache && cache[id]) {
                            render(that, cache[id]);
                            clearInterval(iv);
                        }
                    }, 30);//建议间隔25～50
                }
            }
        }
    });
}
