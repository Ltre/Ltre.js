<?php

class TeamController extends BaseController {

    public function actionSearch(){
        $kw = $this->arg('kw');
        $p = max(1, (int)$this->arg('p')?:1);
        $limit = max(1, min(10, (int)$this->arg('limit')?:10));
        $result = obj('Team')->getListByPage($kw, $p, $limit);
        $this->jsonOutput($result);
    }
    
}