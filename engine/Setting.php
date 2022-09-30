<?php

namespace Engine;

use Engine\Database\Statement;

class Setting {
	private static $setting;

	public static function initialize() {
		self::$setting = self::load();

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

		$statement = new Statement('UPDATE {setting} SET value = :value WHERE section = :section AND name = :name');

		$statement->execute($params);

		Log::write('Setting: ' . $name . ' changed by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'setting');

		Hook::run('setting_update', $params);
		Hook::run('setting_update_' . $name, $params);

		return true;
	}

	public static function load() {
		$setting = [];

		$settings = new Statement('SELECT * FROM {setting}');
		$settings = $settings->execute()->fetchAll();

		foreach($settings as $row) {
			$setting[$row->section][$row->name] = $row->value;
		}

		return json_decode(json_encode($setting));
	}
}
