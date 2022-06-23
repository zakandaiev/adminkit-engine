<?php

namespace Engine;

class Hook {
	private static $actions = [];

	public static function register($name, $function) {
		if(is_string($name) && !empty($name) && is_callable($function)) {
			self::$actions[$name] = $function;

			return true;
		}

		return false;
	}

	public static function run($name, $data = []) {
		if(isset(self::$actions[$name])) {
			return self::$actions[$name]($data);
		}

		return false;
	}

	public static function has($name) {
		if(isset(self::$actions[$name])) {
			return true;
		}

		return false;
	}
}
