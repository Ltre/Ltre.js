
var cataMap = window.cataMap;
var currPurpose = 'compo';

//元素进入编辑模式
function toggleEdit(elem){
    let clz = 'detail-elem-editing';
    let w = $(elem).width();//在改变样式之前记住原宽度
    if (! $(elem).hasClass(clz)) {
        $(elem).addClass(clz);
        $(elem).children('input').width(w).focus().select();
    }
    $('#detail-tip>*').hide();
    $('#detail-tip-edit').show();
}


//元素退出编辑模式
function blurEdit(ipt){
    $(ipt).parent('.detail-elem').removeClass('detail-elem-editing');
    $('#detail-tip-edit').hide();
}


//元素同步显示与编辑的内容，并保存
function syncEdit(ipt, purpose){
    let cata = $(ipt).val();
    let params = {};
    let catagories = [];

    $(ipt).siblings('span').text(cata);

    try {
        $(`.detail-elem-${purpose}`)./* not('.detail-elem-tpl'). */children('input').each((i,e) => {
            e.value = e.value.trim();
            if (! e.value) return;
            if (~ catagories.indexOf(e.value)) {
                throw new Error('检测到重名，系统将只保存一个');
            }
            catagories.push(e.value);
        });
    } catch (err) {
        tip(0, err.message);
        return false;
    }

    params[purpose] = catagories;
    $.post('/production/saveCatagories', params, (j)=>{
        if (! j.result) {
            tip(0, `保存数据失败（${j.msg}）`);
        } else {
            tip(1, '保存成功');
        }
    }, 'json');
}


//新增元素
function appendElem(purpose, cata){
    purpose || (purpose = currPurpose);
    cata || (cata = '');

    let tplClz =  'detail-elem-tpl';
    let tpl = $(`.${tplClz}`);
    let tplNew = tpl.clone();
    tpl.after(tplNew);
    tplNew.
        data('purpose', purpose).
        addClass(`detail-elem-${purpose}`).
        removeClass(tplClz);
    if (purpose == currPurpose) {
        tplNew.show();
    }

    if (! cata) {
        toggleEdit(tplNew);
        tplNew.children('input').val('');
        tplNew.children('span').width(60).text('    ');
    } else {
        tplNew.children('input').val(cata);
        tplNew.children('span').text(cata);
    }
}


//提示
function tip(isSucc, msg){
    let e = $('#detail-tip-err');
    let s = $('#detail-tip-succ');
    if (isSucc) {
        s.text(msg).show();
        e.hide();
        setTimeout(()=>s.hide(), 1500);
    } else {
        e.text(msg).show();
        s.hide();
        setTimeout(()=>e.hide(), 1500);
    }
}



//生产明细 - 选择 [电子元件/鞋体部位/出厂配件]
$('.detail-tab').click(function(){
    let clz = 'detail-tab-select';
    $(this).addClass(clz).siblings().removeClass(clz);
    currPurpose = $(this).data('purpose');
    $('.detail-elem').hide();
    $(`.detail-elem-${currPurpose}`).show();
    $('.detail-right-header-title').text($(this).text());
});



//元素点击后进入编辑模式，失焦后还原
$('body').on('click', '.detail-elem', function(evt){
    toggleEdit(this);
});
$('body').on('blur', '.detail-elem>input', function(evt){
    let $elem = $(this).parent('.detail-elem');
    let purpose = $elem.data('purpose');
    blurEdit(this);
    if (! this.value) { //清空时，也需要同步
        $elem.remove();
        syncEdit(this, purpose);
    }
});
$('body').on('change', '.detail-elem>input', function(evt){
    let $elem = $(this).parent('.detail-elem');
    let purpose = $elem.data('purpose');
    syncEdit(this, purpose);
});
$('body').on('keyup', '.detail-elem>input', function(evt){
    let $elem = $(this).parent('.detail-elem');
    let purpose = $elem.data('purpose');
    if (evt.which == 13) {
        syncEdit(this, purpose);
        blurEdit(this);
    }
});


//点击按钮新增元素
$('.detail-right-header-add').click(function(){
    appendElem();
});

//空闲状态下，按回车键新增元素
$('body').keyup(function(evt){
    if (evt.which == 13 && document.activeElement.tagName.toLowerCase() == 'body') {
        appendElem();
    }
});


//初始化
for (let purpose in cataMap) {
    for (let cata of cataMap[purpose]) {
        appendElem(purpose, cata);
    }
}