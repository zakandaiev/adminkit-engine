<?php

namespace Engine;

class Config {
	private static $config = [];

	public static function initialize() {
		self::loadConfigs();

		return true;
	}

	public static function get($name) {
		return self::$config[$name] ?? [];
	}

	private static function loadConfigs() {
		$path_cfgdir = Path::file('config');

		if(!file_exists($path_cfgdir)) {
			throw new \Exception(sprintf('Configuration folder %s is missed', $path_cfgdir));
		}

		foreach(scandir($path_cfgdir) as $name) {
			if(in_array($name, ['.', '..'], true)) continue;

			if(file_extension($name) !== 'php') continue;

			$path = $path_cfgdir . '/' . $name;

			if($path) {
				$config = require $path;
			} else {
				continue;
			}

			if(!is_array($config)) {
				throw new \Exception(sprintf('Config file %s is invalid', $path));
			} else if(empty($config)) {
				continue;
			}

			self::$config[file_name($name)] = $config;
		}

		return true;
	}
}
