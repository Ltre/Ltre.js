window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

Ltrelib.uploadSetup = function(widgetType, uiTrigger, callbacks){
    callbacks.onUploadStart = callbacks.onUploadStart || function(){};
    callbacks.onUploadEnd = callbacks.onUploadEnd || function(){};
    callbacks.onXhrError = callbacks.onXhrError || function(){};
    callbacks.showUploading = callbacks.showUploading || function(){};
    callbacks.showWaitResponse = callbacks.showWaitResponse || function(){};
    callbacks.onSuccess = callbacks.onSuccess || function(){};
    callbacks.onFail = callbacks.onFail || function(){};

    var fileInputId = 'fuckFile' + (+ new Date()) + Math.floor(Math.random()*100000);
    $('body').append('<input id="' + fileInputId + '" type="file" style="display:none">');
    var fileInput = $('#' + fileInputId);
    
    uiTrigger.click(function(evt){
        if(!! document.all) {
            fileInput[0].select();
            document.execCommand("delete");
        } else {
            fileInput[0].value = '';
        }
        fileInput.click();
    });

    fileInput.change(function(evt){
        if (! (this.files.length > 0)) {
            alert('没有选择文件！');
            return false;
        }
        callbacks.onUploadStart();//上传开始时，一般隐藏结果视图、显示加载中视图
        var fd = new FormData();
        fd.append('filedata', this.files[0]);
        fd.append('fileType', widgetType);
        $.ajax({
            url: 'http://mg-admin.webdev2.duowan.com/jsapi/otherUpload',
            type: 'POST',
            data: fd,
            dataType: 'json',
            contentType: false, //必须设置false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            processData: false, //必须设置false才会自动加上正确的Content-Type
            xhr: function(){
                //捕获上传进度
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(evt){
                        if (evt.lengthComputable) {
                            var perc = Math.round(evt.loaded * 100 / evt.total);
                            if (perc < 100) {
                                callbacks.showUploading(perc);//一般显示为上传中，渲染百分比
                            }
                        }
                    }, false);
                    xhr.upload.addEventListener('load', function(evt){
                        callbacks.showWaitResponse();//一般显示为“100%, 上传即将完成..”即可
                    }, false);
                }
                return xhr;
            },
            success: function(j){
                if (j.code == 0) {
                    callbacks.onSuccess(j.url, j.msg, j);//url, msg, fullRet
                } else {
                    if (j.code == '-4') j.msg = '文件大小超过限制';
                    callbacks.onFail(j.msg, j);//url, msg, fullRet
                }
                callbacks.onUploadEnd();//上传中断或结束时，一般隐藏掉加载中的视图(loading)
            },
            error: function(){
                var errMsg = '出错了! ['+arguments[2]+']';
                callbacks.onXhrError(errMsg);
                callbacks.onUploadEnd();//上传中断或结束时，一般隐藏掉加载中的视图(loading)
            }
        });
    });
};