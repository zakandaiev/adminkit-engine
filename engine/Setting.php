<?php

namespace Engine;

use Engine\Database\Statement;

class Setting {
	private static $setting;

	public static function initialize() {
		$statement = new Statement('SELECT * FROM {setting}');

		$settings = $statement->prepare()->execute()->fetchAll();

		foreach($settings as $row) {
			self::$setting[$row->section][$row->name] = $row->value;
		}

		self::$setting = json_decode(json_encode(self::$setting));

		return true;
	}

	public static function get($section) {
		return self::$setting->{$section} ?? null;
	}
	
	public static function getAll() {
		return self::$setting;
	}

	public static function update($section, $name, $value) {
		if(is_bool($value)) {
			$value = $value ? 'true' : 'false';
		}

		$params = ['section' => $section, 'name' => $name, 'value' => $value];

		$statement = new Statement('UPDATE {setting} SET value=:value WHERE section=:section AND name=:name');

		$statement->prepare()->bind($params)->execute();

		return true;
	}
}