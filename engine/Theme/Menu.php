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
		} else {
			$binding_key = 'name';
		}
		$binding = [$binding_key => $key];

		$sql = "SELECT * FROM {menu} WHERE {$binding_key} = :{$binding_key}";

		$menu = new Statement($sql);

		$menu = $menu->execute($binding)->fetch();

		if(!$menu) {
			return $menu;
		}

		$menu->items = $menu->items ? @json_decode($menu->items) : [];

		return $menu;
	}

	public static function getAll() {
		if(!empty(self::$menu)) {
			return self::$menu;
		}

		$sql = "SELECT * FROM {menu}";

		$menus = new Statement($sql);

		foreach($menus->execute()->fetchAll() as $menu) {
			$menu->items = $menu->items ? @json_decode($menu->items) : [];
			self::$menu[] = $menu;
		}

		return self::$menu;
	}
}
