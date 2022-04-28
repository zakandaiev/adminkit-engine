<?php

namespace Engine;

class Module {
	private static $module = [];
	private static $module_name;

	public static $name;

	public static function initialize() {
		self::loadModules();

		return true;
	}

	public static function get($key) {
		return self::$module[self::$name][$key] ?? [];
	}

	public static function getAll() {
		return self::$module;
	}

	public static function setName($name) {
		self::$name = $name;
		
		return true;
	}

	private static function loadModules() {
		$module_path = Path::file('module');

		foreach(scandir($module_path) as $module) {
			if(in_array($module, ['.', '..'], true)) continue;

			$config_file = $module_path . '/' . $module . '/config.php';
			$routes_file = $module_path . '/' . $module . '/routes.php';
			$languages_dir = $module_path . '/' . $module . '/Language';

			if(file_exists($config_file)) {
				$config = require $config_file;
			} else {
				continue;
			}

			if(!is_array($config) || empty($config)) {
				throw new \Exception(sprintf($module . '\'s config file %s is invalid', $config_file));
			}

			self::$module[$module] = $config;

			if(!$config['enabled']) {
				continue;
			}

			self::$module[$module]['languages'] = self::getLanguages($languages_dir);
			self::$module_name = $module;

			if(file_exists($routes_file)) {
				require $routes_file;
			}
		}

		return true;
	}

	private static function getLanguages($path) {
		$languages = [];

		if(!file_exists($path)) {
			return $languages;
		}

		foreach(scandir($path) as $language) {
			if(in_array($language, ['.', '..'], true)) continue;

			if(file_extension($language) !== 'ini') continue;

			$language = file_name($language);

			list($language_key, $language_region, $language_name) = explode('@', $language, 3);

			$lang['key'] = $language_key ?? null;
			$lang['region'] = $language_region ?? null;
			$lang['name'] = $language_name ?? null;

			if(!$lang['key']) continue;

			$languages[$lang['key']] = $lang;
		}

		return $languages;
	}

	public static function addRoute($method, $uri, $controller, $is_public) {
		list($route_controller, $route_action) = explode('@', $controller, 2);

		if(empty($route_controller) || empty($route_action)) {
			throw new \Exception(sprintf('Invalid controller declaration for %s route in % module', $uri, self::$module_name));
			return false;
		}
		
		self::$module[self::$module_name]['routes'][] = [
			'method' => $method,
			'uri' => $uri,
			'controller' => $route_controller,
			'action' => $route_action,
			'is_public' => $is_public
		];

		return true;
	}

	public static function route($method, $uri, $controller, $is_public = false) {
		return self::addRoute($method, $uri, $controller, $is_public);
	}
}
