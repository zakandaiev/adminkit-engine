<?php

namespace Engine\Theme;

use Engine\Database\Statement;

class Menu {
	private static $menu = [];

	public static function get($key) {
		$key = trim($key, '/');

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

		$menu->items = self::getItems($menu->id);

		return $menu;
	}

	public static function getAll() {
		if(!empty(self::$menu)) {
			return self::$menu;
		}

		$sql = "SELECT * FROM {menu}";

		$menus = new Statement($sql);

		foreach($menus->execute()->fetchAll() as $menu) {
			$menu->items = self::getItems($menu->id);
			self::$menu[] = $menu;
		}

		return self::$menu;
	}

	public static function getItems($id, $language = null) {
		$binding = ['id' => $id, 'language' => $language ?? site('language_current')];

		$sql = "
			SELECT
				*
			FROM
				{menu_translation}
			WHERE
				menu_id = :id
				AND language =
					(CASE WHEN
						(SELECT count(*) FROM {menu_translation} WHERE menu_id = :id AND language = :language) > 0
					THEN
						:language
					WHEN
						(SELECT count(*) FROM {menu_translation} WHERE menu_id = :id AND language = (SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')) > 0
					THEN
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					ELSE
						(SELECT language FROM {menu_translation} WHERE menu_id = :id AND items IS NOT NULL LIMIT 1)
					END)
		";

		$items = new Statement($sql);

		$items = $items->execute($binding)->fetch();

		if(!$items) {
			return [];
		}

		return json_decode($items->items) ?? [];
	}
}
