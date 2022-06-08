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
		return self::$module[self::$name][$key] ?? null;
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

			if(file_exists($config_file)) {
				$config = require $config_file;
			} else {
				continue;
			}

			if(!is_array($config) || empty($config)) {
				throw new \Exception(sprintf($module . '\'s config file %s is invalid', $config_file));
			}

			self::$module[$module] = $config;

			if(!$config['is_enabled']) {
				continue;
			}

			self::$module_name = $module;

			if(file_exists($routes_file)) {
				require $routes_file;
			}
		}

		return true;
	}

	public static function route($method, $uri, $controller, $options = []) {
		list($route_controller, $route_action) = explode('@', $controller, 2);

		if(empty($route_controller) || empty($route_action)) {
			throw new \Exception(sprintf('Invalid controller declaration for %s route in % module', $uri, self::$module_name));
			return false;
		}

		$page = self::formatRouteData('page', @$options['page']);
		$is_public = self::formatRouteData('is_public', @$options['is_public']);
		$breadcrumbs = self::formatRouteData('breadcrumbs', @$options['breadcrumbs']);

		self::$module[self::$module_name]['routes'][] = [
			'method' => $method,
			'uri' => $uri,
			'controller' => $route_controller,
			'action' => $route_action,
			'page' => $page,
			'is_public' => $is_public,
			'breadcrumbs' => $breadcrumbs
		];

		return true;
	}

	private static function formatRouteData($type, $data = null) {
		$formatted = $data;

		switch(strtolower($type)) {
			case 'page': {
				$formatted = (!empty($data)) ? json_decode(json_encode($data)) : new \stdClass();
				break;
			}
			case 'is_public': {
				$formatted = is_bool($data) ? $data : false;
				break;
			}
			case 'breadcrumbs': {
				$formatted = (!empty($data)) ? json_decode(json_encode($data)) : [];
				break;
			}
		}

		return $formatted;
	}
}
