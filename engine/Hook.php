<?php

namespace Engine;

class Hook {
	private static $actions = [];

	public static function register($name, $function) {
		if(is_string($name) && !empty($name) && is_callable($function)) {
			self::$actions[$name][] = $function;
		}
	}

	public static function run($name, $args = []) {
		if(!empty(self::$actions[$name])) {
			foreach(self::$actions[$name] as $f) {
				$f($args);
			}
		}
	}

	public static function has($name) {
		if(isset(self::$actions[$name])) {
			return true;
		}

		return false;
	}
}
