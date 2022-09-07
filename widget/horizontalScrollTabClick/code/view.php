<?php
$mList = [];
for ($m = '202001'; $m<'202209'; $m=date('Ym', strtotime("{$m}01 +1month"))) {
    $mList[] = $m;
}
$this->mList = $mList;
$this->display('view.html');