window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

//支持多图、多类型上传，能够多样化处理上传结果
//上传的最基本控件：input:file
//核心过程：
//  生成隐藏的input:file控件；
//  监听input:file的change事件
//  通过任何方式，触发input:file被click，注意触发前需要清理input:file上绑定的数据
//  当change事件发生后，有以下过程可参数化：
//      0、[onNoFile]没有选择文件时，可能需要的额外处理过程
//      1、[onBefore]上传前，这时已确定有选择文件，可以用来判断已选文件个数、文件属性分析等操作；如果onBefore返回false，则调用onEnd清理现场
//      2、[onStart]上传开始时，一般隐藏结果视图、显示加载中视图
//      3、[onUploading]上传中，一般用来渲染进度百分比
//      4、[onWaiting]上传完成，等待服务端处理和响应。一般此时会作类似"100%, 处理中.."的提示
//      5、[onResponse]服务端成功响应时执行, 执行完毕后会接着调用onEnd
//      6、[onNetError]通信错误时执行, 执行完毕后会接着调用onEnd
//      7、[onEnd]全部流程完成或被中断时，一般用于清理现场
//设置的条件：
//  1、设置上传地址
//  2、设置FormData文件域的名称，例如filedata，核心代码将实现为 var fd = new FormData(); fd.append('filedata', file或files)
//  3、设置其它参数表，根据具体业务
//  4、是否多文件上传
Ltrelib.universalUpload = function(){

    var that = this;
    var fileInputId;
    var fileInput;
    
    that.api = null;
    that.fileInputName = null;//FormData文件域的名称
    that.bizParams = {};
    that.isMultiple = false;
    that.uploadWay = 'raw';//raw|jquery
    
    that.onNoFile = function(){};
    that.onBefore = function(files){};
    that.onStart = function(){};
    that.onUploading = function(perc, progressEvt){};
    that.onWaiting = function(){};
    that.onResponse = function(resp){};
    that.onNetError = function(errMsg){};
    that.onEnd = function(){};
    
    var checkSetup = function(){
        if (!that.api || !/^(https?\:)?\/\//.test(that.api)) throw new Error("上传接口有误");
        if (!that.fileInputName) throw new Error("文件域未命名");
    };
    
    var buildFormData = function(files){
        var fd = new FormData();
        fd.append(that.fileInputName, that.isMultiple ? files : files[0]);
        for (var i in that.bizParams) {
            if ('function' != typeof that.bizParams[i]) {
                fd.append(i, that.bizParams[i]);
            }
        }
        return fd;
    };
    
    var jQueryUpload = function(formdata){
        $.ajax({
            url: that.api,
            type: 'POST',
            data: formdata,
            dataType: 'json',
            contentType: false, //必须设置false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            processData: false, //必须设置false才会自动加上正确的Content-Type
            xhr: function(){
                //捕获上传进度
                var xhr = $.ajaxSettings.xhr();
                xhr.withCredentials = true;
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
        xhr.addEventListener('load', function(evt){
            var jsonText = xhr.responseText;
            var j = ('JSON' in window && 'parse' in JSON ) ? JSON.parse(jsonText) : eval('('+jsonText+')');
            that.onResponse(j);
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
        that.onBefore(files);
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
        fileInputId = 'fuckFile' + (+ new Date()) + Math.floor(Math.random()*100000);
        $('body').append('<input id="' + fileInputId + '" type="file" style="display:none">');
        fileInput = $('#' + fileInputId);
        fileInput.change(onChangeFileInput);
    };
    
    //批量设置
    that.setup = function(map){
        if ('object' != typeof map) throw new Error('map参数有误');
        var keys = [
            'api', 'fileInputName', 'bizParams', 'isMultiple',
            'onNoFile', 'onBefore', 'onStart', 'onUploading', 'onWaiting', 'onResponse', 'onEnd'
        ];
        for (var i in keys) {
            if (keys[i] in map) {
                that[keys[i]] = map[keys[i]];
            }
        }
    };
    
    //绑定触发上传的过程，例如点击某按钮、拖放文件等
    that.bindTrigger = function(callback){
        checkSetup();
        callback.call(this, function(evt){
            if(!! document.all) {
                fileInput[0].select();
                document.execCommand("delete");
            } else {
                fileInput[0].value = '';
            }
            fileInput.click();
        });
    };
    
    buildFileInput();
    
};

