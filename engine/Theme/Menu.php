<?php

namespace Engine\Theme;

use Engine\Database\Statement;

class Menu {
	private static $menu = [];

	public static function get($key) {
		if(isset(self::$menu[$key])) {
			return self::$menu[$key];
		}

		if(is_numeric($key)) {
			$binding_key = 'id';
			$binding = ['id' => $key];
		} else {
			$binding_key = 'name';
			$binding = ['name' => $key];
		}

		$sql = "
			SELECT
				t_menu_item.*
			FROM
				{menu_item} t_menu_item
			INNER JOIN
				{menu} t_menu
			ON
				t_menu_item.menu_id = t_menu.id
			WHERE
				t_menu.{$binding_key}=:{$binding_key}
		";

		$menu = new Statement($sql);

		$menu = $menu->prepare()->bind($binding)->execute()->fetchAll(\PDO::FETCH_ASSOC);

		if(empty($menu)) {
			return $menu;
		}

		$menu_formatted = [];
		foreach($menu as $item) {
			$item['children'] = [];
			$menu_formatted[$item['id']] = $item;
		}

		foreach($menu_formatted as $k => &$v) {
			if($v['parent'] != 0) {
				$menu_formatted[$v['parent']]['children'][] =& $v;
			}
		}
		unset($v);

		foreach($menu_formatted as $k => $v) {
			if($v['parent'] != 0) {
				unset($menu_formatted[$k]);
			}
		}

		return $menu_formatted;
	}
}
