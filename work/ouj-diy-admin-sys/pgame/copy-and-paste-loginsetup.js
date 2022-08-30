/**
 * 复制并粘贴页游中游戏区服的接口密钥等配置信息，以减轻运营人员的手动粘贴负担
 * 
 * 部署方法：
 *      打开admin.[].com后台DIY系统
 *      进入【页游管理】【游戏维护】【登录配置】界面
 *      点击右侧iframe的顶部搜索旁边的【编辑配置】橙色按钮，进入到类似于此的地址： http://admin.[].com/DiyConfig/edit?tableId=6082ffe3-e1df-952c-ff44-938fc13585cf&tableType=1
 *      找到【内嵌Css或Js】填写框，将此代码填入，记得用<script>包裹
 */
setTimeout(function(){

    //三行没啥用，但是有价值的代码 -Begin-
    let tableId = (location.search.match(/[?&]tableId=([^?&]+)/) || [,])[1];
    let setup_id = 659;//具体数据ID
    let api = `${location.protocol}//${location.host}/diyEdit/addView?tableId=${tableId}&setup_id=${setup_id}`; //点击修改按钮后加载HTML的接口
    //三行没啥用，但是有价值的代码 -End-

    let modal = null;
    let DATA = null;

    let fltpl = '\
        <div id="sbfloat" class="btn btn-lg" style="position: fixed;width: 252px;height: 263px;right: 0px;white-space: pre-wrap;bottom: 0px;z-index: 9999;font-size: 35px;display:none;"> \
            <a id="sbpaste" class="btn btn-danger" style="width: 100%;height: 75px;right: 0px;white-space: pre-wrap;font-size: 46px;">←←粘贴</a> \
            <a id="sbcopy" class="btn btn-info" style="width: 100%;height: 128px;right: 0px;white-space: pre-wrap;font-size: 21px;">←← 复制登录配置的数据（加载地址/充值接口/货币名/汇率/角色接口/密钥）</a> \
        </div> \
    ';
    
    $('body').append(fltpl);
    
    setInterval(()=>{
        
        let isAddMode = $('#addModal').size() > 0 && $('#addModal').css('display') != 'none';
        let isEditMode = $('#editModal').size() > 0 && $('#editModal').css('display') != 'none';
        if (isAddMode || isEditMode) {
            $('#sbfloat').show();
            MODAL = isAddMode ? $('#addModal') : $('#editModal');
        } else {
            $('#sbfloat').hide();
            MODAL = null;
        }
    }, 1500);
    
    $('#sbcopy').click(function(){
        if (! MODAL) {
            alert('当前不处于编辑或新增模式，无法复制数据');
            return false;
        }
        
        DATA = {
            login_url: MODAL.find('[name=login_url]').val(),
            recharge_url: MODAL.find('[name=recharge_url]').val(),
            coin_name: MODAL.find('[name=coin_name]').val(),
            rate: MODAL.find('[name=rate]').val(),
            role_update_url: MODAL.find('[name=role_update_url]').val(),
            has_role_data: MODAL.find('[name=has_role_data]:checked').val(),
            secret: MODAL.find('[name=secret]').val(),
            secret_login: MODAL.find('[name=secret_login]').val(),
            secret_role: MODAL.find('[name=secret_role]').val(),
            secret_charge: MODAL.find('[name=secret_charge]').val()
        };
        console.log({DATA});
        alert(`已复制，仅限本页有效（关闭、或新开页面均失效） \n\n  ${JSON.stringify(DATA)}`)
    });
    
    
    $('#sbpaste').click(function(){
        if (! MODAL) {
            alert('当前不处于编辑或新增模式，无法粘贴数据');
            return false;
        }
        
        if (! DATA) {
            alert('剪贴板没有数据');
            return false;
        }
        
        let msg = `要使用此数据覆盖当前表单吗？ \n\n \
            游戏加载地址: ${DATA.login_url}, \n  \
            充值接口: ${DATA.recharge_url}, \n  \
            货币名: ${DATA.coin_name}, \n  \
            汇率: ${DATA.rate}, \n  \
            角色接口: ${DATA.role_update_url}, \n  \
            厂商是否提供角色数据: ${DATA.has_role_data}, \n  \
            通用密钥: ${DATA.secret}, \n  \
            登录密钥: ${DATA.secret_login}, \n  \
            角色密钥: ${DATA.secret_role}, \n  \
            充值密钥: ${DATA.secret_charge} \n  \
            \n \
            \n \
            要使用此数据覆盖当前表单吗？
        `;
        if (! confirm(msg)) return false;
        
        MODAL.find('[name=login_url]').val(DATA.login_url);
        MODAL.find('[name=recharge_url]').val(DATA.recharge_url),
        MODAL.find('[name=coin_name]').val(DATA.coin_name),
        MODAL.find('[name=rate]').val(DATA.rate),
        MODAL.find('[name=role_update_url]').val(DATA.role_update_url),
        MODAL.find(`[name=has_role_data][value=${DATA.has_role_data}]`).attr('checked', true).click();
        MODAL.find('[name=secret]').val(DATA.secret),
        MODAL.find('[name=secret_login]').val(DATA.secret_login),
        MODAL.find('[name=secret_role]').val(DATA.secret_role),
        MODAL.find('[name=secret_charge]').val(DATA.secret_charge)
    });
    
}, 3500);
