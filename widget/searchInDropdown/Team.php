<?php

class Team extends Model {

    protected $table_name = 'team';

    public function getListByPage($kw = '', $p = 1, $limit = 10){
        $p = max(1, (int)$p?:1);
        $limit = max(1, min(10, (int)$limit?:10));
        $where = ['AND', ['is_del', '=', 0]];
        if (! empty($kw)) {
            $kwWhere = [
                'OR',
                ['team_name', 'LIKE', "%{$kw}%"],
                ['team_full_name', 'LIKE', "%{$kw}%"],
            ];
            if (is_numeric($kw)) $kwWhere[] = ['team_id', '=', $kw];
            $where[] = $kwWhere;
        }
        @$result = obj('SeniorModel')->seniorSelect([
            'from' => 'team',
            'where' => $where,
            'orderBy' => 'team_id DESC',
            'limitBy' => [$p, $limit, 10],
            'listable' => true,
            'pageable' => true,
        ]);
        unset($result['debug']);

        //处理其它字段
        static $acMap = [];
        foreach ($result['list'] as $k => $v) {
            $ac = $acMap[$v['ac_id']] = isset($acMap[$v['ac_id']]) ? $acMap[$v['ac_id']] : obj('Activity')->find(['ac_id' => $v['ac_id']]);
            $result['list'][$k]['ac_name'] = $ac['ac_name'];
            $result['list'][$k]['team_logo'] = $v['team_logo'] ?: 'http://att.bbs.duowan.com/avatar/noavatar_small.jpg';
        }

        return $result;
    }

}