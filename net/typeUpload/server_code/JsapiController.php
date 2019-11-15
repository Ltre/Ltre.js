<?php

class JsapiController extends BaseController {

    //上传其它
    public function actionOtherUpload(){
        $this->dealOptionsMethod();
	    if (empty($this->yyuid)) $this->jsonOutput(array('code' => -999, 'msg' => '未登录', 'rs' => false));
	    $file = $_FILES['filedata'];
        $fileType = $this->arg('fileType');
        $client = obj('OtherUploadClient');
        switch ($fileType) {
            case 'img':
                $client->limit(array(
                    'maxSize' => 1024 * 1024 * 3,
                    'fileExt' => array(
                        '/^jpg|gif|png|webp$/' => function($regExp, $ext){ return '仅限上传图片!'; }
                    ),
                ));
                break;
            case 'video':
                $client->limit(array(
                    'maxSize' => 1024 * 1024 * 3,
                    'fileExt' => array(
                        '/^mp4$/' => function($regExp, $ext){ return '仅限上传MP4文件!'; }
                    ),
                ));
                break;
            case 'flash':
                $client->limit(array(
                    'maxSize' => 1024 * 1024 * 3,
                    'fileExt' => array(
                        '/^(flv|swf)$/' => function($regExp, $ext){ return '仅限上传FLV、SWF文件!'; }
                    ),
                ));
                break;
            default: $this->jsonOutput(array('msg' => 'HEHE!', 'code' => -123456789, 'rs' => false));
        }
	    $ret = $client->up($file);
        $ret['rs'] = $ret['code'] == 0;
	    $this->jsonOutput($ret);
    }

}
