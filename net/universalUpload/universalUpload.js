window.LtreLib = window.LtreLib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

/**
 * 支持多图、多类型上传，能够多样化处理上传结果
 * 
 * 核心过程：
 *      1、生成隐藏的input:file控件；
 *      2、监听input:file的change事件；
 *      3、通过任何方式，触发input:file被click；
 *      4、在上传的每个过程执行自定义逻辑；
 *      5、使用FormData和XHR上传文件
 * 
 * 当input:file的change事件发生后，以下过程可参数化：
 *      0、[onNoFile]没有选择文件时，可能需要的额外处理过程
 *      1、[onBefore]上传前，这时已确定有选择文件，可以用来判断已选文件个数、文件属性分析等操作；如果onBefore返回false，则调用onEnd清理现场
 *      2、[onStart]上传开始时，一般隐藏结果视图、显示加载中视图
 *      3、[onUploading]上传中，一般用来渲染进度百分比
 *      4、[onWaiting]上传完成，等待服务端处理和响应。一般此时会作类似"100%, 处理中.."的提示
 *      5、[onResponse]服务端成功响应时执行, 执行完毕后会接着调用onEnd
 *      6、[onNetError]通信错误时执行, 执行完毕后会接着调用onEnd
 *      7、[onEnd]全部流程完成或被中断时，一般用于清理现场
 * 
 * 基本配置条件：
 *      1、[api]设置上传地址
 *      2、[fileInputName]设置FormData文件域的名称，例如filedata，核心代码将实现为 var fd = new FormData(); fd.append('filedata', file或files)
 *      3、[bizParams]设置其它参数表，根据具体业务
 *      4、[isMultiple]是否多文件上传
 *      5、[uploadWay]上传途径：raw|jquery
 *      6、[respType]响应类型：默认使用json响应, 全部值：xml,html,script,json,text。
 *          因上传不适用GET，故不含jsonp。
 *          在jQuery上传模式下，支持全部值；
 *          在原生AJAX上传模式下，仅支持json和text
 * 
 * 示例1 (标记过时, 不推荐)：
 *      let uu = new LtreLib.universalUpload;
 *      uu.api = 'xxxxx';
 *      uu.fileInputName = 'yyyyy';
 *      ...
 *      uu.bindTrigger(function(trigger){
 *          $('#example').click(trigger);
 *      });
 * 
 * 示例2：
 *      let uu = new LtreLib.universalUpload;
 *      uu.api = 'xxxxx';
 *      uu.fileInputName = 'yyyyy';
 *      //代替bindTrigger()
 *      uu.trigger = {domSelector:'#example', evtType:'click'};
 *      ...
 * 
 * 示例3:
 *      let uu = new LtreLib.universalUpload;
 *      uu.setup({
 *          api: 'xxxx',
 *          fileInputName = 'yyyy',
 *          trigger: {domSelector:'#example', evtType:'click'},
 *          ...
 *      });
 * 
 * 示例4:
 *      let uu = new LtreLib.universalUpload({
 *          api: 'xxxx',
 *          fileInputName = 'yyyy',
 *          trigger: {domSelector:'#example', evtType:'click'},
 *          ...
 *      });
 *      
 * @param {Object} setupArgs 一次性配置所有参数（可选）
 */
LtreLib.universalUpload = function(setupArgs){

    var that = this;
    var raw = {};
    var fileInputId;
    var fileInput;

    that.api = null;
    that.fileInputName = null;
    that.bizParams = {};
    that.isMultiple = false;
    that.acceptMime = '';
    that.uploadWay = 'raw';
    that.respType = 'json';
    that.trigger = {domSelector: '#example', evtType: 'click'};
    
    that.onNoFile = function(){};
    that.onBefore = function(files){};
    that.onStart = function(){};
    that.onUploading = function(perc, progressEvt){};
    that.onWaiting = function(){};
    that.onResponse = function(resp){};
    that.onNetError = function(errMsg){};
    that.onEnd = function(){};

    setInterval(function(){
        let ifThenMap = {
            isMultiple: buildFileInput,//监听并重载上传控件
            acceptMime: buildFileInput,//监听并重载上传控件
            trigger: bindTrigger,
        };
        for (k in ifThenMap){
            if (!(k in raw) || raw[k] !== that[k]) {
                raw[k] = that[k];
                ifThenMap[k].call(that);
            }
        }
    }, 250);

    var checkSetup = function(){
        if (!that.api || !/^(https?\:)?\/\//.test(that.api)) throw new Error("上传接口有误");
        if (!that.fileInputName) throw new Error("文件域未命名");
        if (-1 === ['xml', 'html', 'script', 'json', 'text'].indexOf(that.respType)) throw new Error("响应类型设置有误");
    };
    
    var buildFormData = function(files){
        var fd = new FormData();
        if (that.isMultiple) {
            for (var f of files) fd.append(`${that.fileInputName}[]`, f);
        } else {
            fd.append(that.fileInputName, files[0]);
        }
        for (var i in that.bizParams) {
            if ('function' != typeof that.bizParams[i]) {
                fd.append(i, that.bizParams[i]);
            }
        }
        return fd;
    };
    
    var isJson = function(respText){
        var r1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var r2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var r3 = /(?:^|:|,)(?:\s*\[)+/g;
        //不通过直接JSON.parse或eval执行验证，防止XSS
        return /^[\],:{}\s]*$/.test(
            respText.replace(
                r1, "@"
            ).replace(
                r2, "]"
            ).replace(r3, "")
        );
    };
    
    var xhrUpstreamMonitor = function(xhr){
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', function(evt){
                if (evt.lengthComputable) {
                    var perc = Math.round(evt.loaded * 100 / evt.total);
                    if (perc < 100) {
                        that.onUploading(perc, evt);
                    }
                }
            }, false);
            xhr.upload.addEventListener('load', function(evt){
                that.onWaiting();
            }, false);
        }
    };

    var jQueryUpload = function(formdata){
        $.ajax({
            url: that.api,
            type: 'POST',
            data: formdata,
            dataType: that.respType,
            contentType: false, //必须设置false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            processData: false, //必须设置false才会自动加上正确的Content-Type
            xhr: function(){
                //捕获上传进度
                var xhr = $.ajaxSettings.xhr();
                xhr.withCredentials = true;
                xhrUpstreamMonitor(xhr);
                return xhr;
            },
            success: function(j){
                that.onResponse(j);
                that.onEnd();
            },
            error: function(){
                //var errMsg = '出错了! ['+arguments[2]+']';
                var errMsg = '出错了!';
                console.log(arguments);
                that.onNetError(errMsg);
                that.onEnd();
            }
        });
    };

    var upload = function(formdata){
        var xhr = new XMLHttpRequest();
        xhrUpstreamMonitor(xhr);
        xhr.addEventListener('load', function(evt){
            var resp = xhr.responseText;
            if (that.respType == 'json') {//暂时仅处理json，其它类型原样传递
                if (! isJson(resp)) {
                    throw new Error("响应内容有误，期望类型[json]");
                }
                resp = ('JSON' in window && 'parse' in JSON ) ? JSON.parse(resp) : eval('('+resp+')');
            }
            that.onResponse(resp);
            that.onEnd();
        }, false);
        xhr.addEventListener('error', function(error){
            var errMsg = '出错了!';
            console.log(error);
            that.onNetError(errMsg);
            that.onEnd();
        }, false);
        xhr.open('POST', that.api, true);
        xhr.withCredentials = true;
        xhr.send(formdata);
    };

    var onChangeFileInput = function(evt){
        var files = evt.currentTarget.files;
        if (! (files.length > 0)) {
            that.onNoFile();
            return false;
        }
        if (! that.onBefore(files)) {
            return false;
        }
        that.onStart();
        var fd = buildFormData(files);
        //为什么实现两种方式上传？看使用者喜好，可以删掉不需要的方式。目前代码使用非jQuery方式，获取的xhr与使用jQuery方式得到的值不同，具体还在找原因。推荐使用非jQuery方式
        if (that.uploadWay == 'jquery') { //'jQuery' in window && window.jQuery === window.$
            jQueryUpload(fd);
        } else {
            upload(fd);
        }
    };

    var buildFileInput = function(){
        if (! fileInputId) {
            fileInputId = 'fuckFile' + (+ new Date()) + Math.floor(Math.random()*100000);
            let htmlMulti = that.isMultiple ? ' multiple="1" ' : '';
            let htmlAcceptMime = that.acceptMime ? ` accept="${that.acceptMime}" ` : '';
            let htmlInput = `<input id="${fileInputId}" type="file" ${htmlMulti} ${htmlAcceptMime} style="display:none">`;
            $('body').append(htmlInput);
            fileInput = $('#' + fileInputId);
            fileInput.change(onChangeFileInput);
        } else {
            let attrs = {};
            that.acceptMime && (attrs.accept = that.acceptMime);
            that.isMultiple && (attrs.multiple = true);
            $('#' + fileInputId).attr(attrs);
        }
    };

    /**
     * 绑定触发源及触发方式
     *      例如点击某按钮、拖放文件等 (该方法只能执行一次).
     *      触发前会清理input:file上已有的文件数据.
     * 
     * @date 20220415调整：
     *      不再推荐直接使用此接口，
     *      而是通过设置trigger属性，以完成绑定。
     * 
     * @param {Function} callback 当本方法作为外部接口提供时，所需传入的具体事件绑定方法，其接受一个用于事件回调的Function型参数
     */
    var bindTrigger = function(callback){
        if (this.__lockOfBindTrigger) return;
        this.__lockOfBindTrigger = true;

        // checkSetup();
        let thencb = function(evt){
            if(!! document.all) {
                fileInput[0].select();
                document.execCommand("delete");
            } else {
                fileInput[0].value = '';
            }
            fileInput.click();
        };

        if (callback && typeof callback == 'function') {
            callback.call(this, thencb);
        } else {
            $('body').on(that.trigger.evtType, that.trigger.domSelector, thencb);
        }
    };

    //批量设置
    var setup = function(map){
        if ('object' != typeof map) throw new Error('参数错误');
        var keys = [
            'api', 'fileInputName', 'bizParams', 'isMultiple', 'acceptMime', 'uploadWay', 'respType', 'trigger',
            'onNoFile', 'onBefore', 'onStart', 'onUploading', 'onWaiting', 'onResponse', 'onEnd'
        ];
        for (var i in keys) {
            if (keys[i] in map) {
                that[keys[i]] = map[keys[i]];
            }
        }
        checkSetup();
    };
    
    //根据构造参数，决定是否立即初始化配置
    if ('object' == typeof setupArgs) { //立即进行
        setup(setupArgs);
        that.setup = function(){
            throw new Error('已设置过初始化参数，禁止再次设置');
        };
    } else { //延后进行
        that.setup = setup;
    }

    //开放触发过程的绑定接口（这个是旧用法，新用法建议使用trigger属性）
    that.bindTrigger = bindTrigger;

    //在初始化配置完成后，立即生成文件控件
    buildFileInput();
};
