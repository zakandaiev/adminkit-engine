<?php

namespace Engine;

class Module {
	private static $module = [];
	private static $name;

	public static function initialize() {
		self::loadModules();

		return true;
	}

	public static function get($key, $name = null) {
		return self::$module[$name ?? self::$name][$key] ?? null;
	}

	public static function getSelf($name = null) {
		return self::$module[$name ?? self::$name] ?? null;
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

		$modules = [];

		foreach(scandir($module_path) as $module) {
			if(in_array($module, ['.', '..'], true)) continue;

			$config_file = $module_path . '/' . $module . '/config.php';

			if(is_file($config_file)) {
				$config = require $config_file;
			} else {
				continue;
			}

			if(!is_array($config) || empty($config)) {
				throw new \Exception(sprintf($module . '\'s config file %s is invalid', $config_file));
			}

			$config['name'] = $module;
			$config['languages'] = Language::getModuleLanguages($module);

			$modules[] = $config;
		}

		usort($modules, function ($module1, $module2) {
			if(isset($module1['priority']) && isset($module2['priority'])) {
				return $module2['priority'] <=> $module1['priority'];
			} else if(isset($module1['priority'])) {
				return 1;
			}
			return 0;
		});

		foreach($modules as $module) {
			self::$module[$module['name']] = $module;

			if(!$module['is_enabled']) {
				continue;
			}

			$routes_file = $module_path . '/' . $module['name'] . '/routes.php';
			$hooks_file = $module_path . '/' . $module['name'] . '/hooks.php';
			if($module['name'] === 'Public') {
				$hooks_file = Path::file('theme') . '/hooks.php';
			}

			self::$name = $module['name'];

			if(is_file($routes_file)) {
				require $routes_file;
			}

			if(is_file($hooks_file)) {
				// require $hooks_file;
			}
		}

		return true;
	}

	public static function update($key, $value, $module = null) {
		$name = $module ?? self::$name;
		$config_file = Path::file('module') . '/' . $name . '/config.php';

		if(!is_file($config_file)) {
			return false;
		}

		if(is_numeric($value)) {
			$value = $value;
		} else if(is_string($value)) {
			$value = "'$value'";
		} else if(is_bool($value)) {
			$value = $value ? 'true' : 'false';
		} else if(is_null($value)) {
			$value = 'null';
		} else {
			return false;
		}

		$config_content = file_get_contents($config_file);

		$replacement = "'$key' => $value";

		if(preg_match('/([\'"]' . $key . '[\'"][\s]*=>)/mi', $config_content)) {
			$pattern = '/([\'"]' . $key . '[\'"][\s]*=>[\s]*[^,\]\n\/#]+)/mi';
		} else {
			$pattern = '/(return[\s]*(\[|array\())/mi';
			$replacement = "$1\n\t" . $replacement . ",";
		}

		$config_content = preg_replace($pattern, $replacement, $config_content);

		static $is_edited = false;

		if(file_put_contents($config_file, $config_content, LOCK_EX)) {
			if(!$is_edited) {
				Log::write('Module: ' . $name. ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');
				Hook::run('module_update', $name);
			}

			$is_edited = true;

			return true;
		}

		return false;
	}

	public static function delete($name) {
		Log::write('Module: ' . $name. ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_delete', $name);

		return rmdir_recursive(Path::file('module') . '/' . $name);
	}

	public static function route($method, $uri, $controller, $options = []) {
		if(is_closure($controller)) {
			$route_controller = $controller;
			$route_action = null;
		} else {
			list($route_controller, $route_action) = explode('@', $controller, 2);

			if(empty($route_controller) || empty($route_action)) {
				throw new \Exception(sprintf('Invalid controller declaration for %s route in % module', $uri, self::$name));
				return false;
			}
		}

		$page = self::formatRouteData('page', @$options['page']);
		$is_public = self::formatRouteData('is_public', @$options['is_public']);
		$breadcrumbs = self::formatRouteData('breadcrumbs', @$options['breadcrumbs']);

		self::$module[self::$name]['routes'][] = [
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

		switch(strtolower($type ?? '')) {
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

	public static function install($name) {
		$path = Path::file('module') . '/' . $name . '/Install';

		if(!file_exists($path)) {
			return false;
		}

		// INSTALL SCRIPT
		$path_install = $path . '/install.php';

		if(is_file($path_install)) {
			require $path_install;
		}

		Log::write('Module: ' . $name. ' installed by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_install', $name);

		return true;
	}

	public static function uninstall($name) {
		$path = Path::file('module') . '/' . $name . '/Uninstall';

		if(!file_exists($path)) {
			return false;
		}

		// UNINSTALL SCRIPT
		$path_uninstall = $path . '/uninstall.php';

		if(is_file($path_uninstall)) {
			require $path_uninstall;
		}

		Log::write('Module: ' . $name. ' uninstalled by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_uninstall', $name);

		return true;
	}
}
