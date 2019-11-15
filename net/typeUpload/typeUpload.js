//@todo 待调整代码，待测试

window.Ltrelib = window.Ltrelib || {};//使用一个生僻的名称作为全局变量，以存储自定义的库，防止与其它变量冲突

Ltrelib.typeUpload = function(widgetType, uiTrigger, callbacks){
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
                xhr.withCredentials = true;
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

/**
 * 跨域传cookie问题
 *  1、客户端未设置xhr.withCredentials = true，服务端设置Access-Control-Allow-Origin: *，可跨域成功，但无法传递cookie
 *  2、客户端已设置xhr.withCredentials = true，则服务端不能将Access-Control-Allow-Origin:设置为*，而必须设置具体的ORIGIN头，即header('Access-Control-Allow-Origin: 'www.abc.com')，且还要设置header('Access-Control-Allow-Credentials: true');
 *
 *  综上，不论是否设置xhr.withCredentials=true，都在服务端设置 header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN']?:'*')) 和 header('Access-Control-Allow-Credentials: true')，是最保险的
 *
 *  在PHP服务端检测是否设置xhr.withCredentials = true，通常可以通过判断$_SERVER['HTTP_COOKIE']是否存在来确定
 *
 * 后端代码部署(PHP示例)：
 *  1、开始上传前，如果是跨域的POST，则JS会向服务端先发起OPTIONS请求，处理的关键代码为：
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'options') {
            header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN']?:'*'));
            header('Access-Control-Allow-Credentials: true');
            header(0, 0, 204);
            exit;
        }
    2、上传的POST请求处理代码：
        $data = array();//业务处理反馈数据
        $callback = 'callback';
	    header("Content-Type: application/x-javascript; charset=UTF-8");
        @header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN']?:'*'));//这是关键代码1
        header('Access-Control-Allow-Credentials: true');//这是关键代码2
		$fun = $_REQUEST[$callback];//这里需要具体的参数过滤，防止渗透
		$json = json_encode($data);
		echo empty($fun)? $json : "{$fun}({$json})";
		exit;
 */