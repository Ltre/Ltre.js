<?php
class BaseController extends Controller{

    public function arg($name = null, $default = null, $callback_funcname = null){
        $ret = parent::arg($name, $default, $callback_funcname);
        if( is_array($ret) ){
            array_walk($ret, function(&$v, $k){$v = trim(htmlspecialchars($v, ENT_QUOTES, 'UTF-8'));} );
        }else{
            $ret = trim(htmlspecialchars($ret, ENT_QUOTES, 'UTF-8'));
        }
        return $ret;
    }

    
	public function jsonOutput($data, $callback='callback'){
	    header("Content-Type: application/x-javascript; charset=UTF-8");
        header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN']?:'*'));
        header('Access-Control-Allow-Credentials: true');
		$fun = $this->arg($callback);
		$json = json_encode($data);
		echo empty($fun)? $json : "{$fun}({$json})";
		exit;
	}


    protected function isPost(){
        return $_SERVER['REQUEST_METHOD'] == 'POST';
    }

    //处理OPTIONS请求，前提：r参数必须必须必须写到URL里！！！
    public function dealOptionsMethod(){
        if (strtolower($_SERVER['REQUEST_METHOD']) === 'options') {
            header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN']?:'*'));
            header('Access-Control-Allow-Credentials: true');
            header(0, 0, 204);
            exit;
        }
    }
} 