<?php

namespace Engine;

class Hook {
	private static $actions = [];

	public static function register($name, $function) {
		if(is_string($name) && !empty($name) && is_closure($function)) {
			self::$actions[$name][] = $function;

			return true;
		}

		return false;
	}

	public static function run($name, $data = null) {
		if(isset(self::$actions[$name]) && !empty(self::$actions[$name])) {
			foreach(self::$actions[$name] as $hook) {
				$hook($data);
			}

			return true;
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
