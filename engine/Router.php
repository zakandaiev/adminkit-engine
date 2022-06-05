<?php

namespace Engine;

use Engine\Database\Statement;

class Router {
	private static $uri;
	private static $method;

	public static $route = [];

	public static function initialize() {
		self::$method = Request::$method;
		self::$uri = strtok(Request::$uri, '?');

		self::checkRoutes();
		self::checkForm();
		self::check404();
		self::setController();
	}

	private static function checkRoutes() {
		foreach(Module::getAll() as $module) {
			if(!$module['is_enabled']) {
				continue;
			}

			if(isset($module['routes']) && !empty($module['routes'])) {
				foreach($module['routes'] as $route) {
					if(self::checkRoute($module['name'], $route)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	private static function checkRoute($module, $route) {
		if(strtolower(trim($route['method'])) === self::$method && self::isRouteMatched($route['uri'])) {
			foreach($route as $key => $value) {
				self::$route[$key] = $value;
			}

			Module::setName($module);

			return true;
		}

		self::$route = [];

		return false;
	}

	private static function isRouteMatched($route) {
		$parameters = [];

		self::$route['parameters'] = $parameters;

		if($route === '/' && self::$uri === '/') {
			return true;
		}

		$route = ($route === '/') ? $route : rtrim($route, '/');
		$uri = (self::$uri === '/') ? self::$uri : rtrim(self::$uri, '/');

		$route_parts = explode('/', $route);
		$uri_parts = explode('/', $uri);
		array_shift($route_parts);
		array_shift($uri_parts);

		$languages = [];
		foreach(Module::getAll() as $module) {
			if(!$module['is_enabled']) {
				continue;
			}

			foreach($module['languages'] as $language) {
				if(!in_array($language['key'], $languages)) {
					$languages[] = $language['key'];
				}
			}
		}

		if(in_array($uri_parts[0], $languages)) {
			Language::setCookie($uri_parts[0]);

			array_shift($uri_parts);

			if($route === '/' && count($uri_parts) === 0) {
				return true;
			}
		}

		if(count($route_parts) !== count($uri_parts)) {
			return false;
		}

		for($__i__ = 0; $__i__ < count($route_parts); $__i__++) {
			$route_part = $route_parts[$__i__];

			if(preg_match('/^[$]/', $route_part)) {
				$found_variable = ltrim($route_part, '$');
				$parameters[$found_variable] = $uri_parts[$__i__];
			} else if($route_parts[$__i__] !== $uri_parts[$__i__]) {
				return false;
			}
		}

		self::$route['parameters'] = $parameters;

		return true;
	}

	private static function checkForm() {
		if(self::$method !== 'post') {
			return false;
		}

		$statement = new Statement('SELECT * FROM {form}');

		$forms = $statement->execute()->fetchAll();

		if(empty($forms)) {
			return false;
		}

		$now_timestamp = time();

		foreach($forms as $form) {
			$cdate_timestamp = strtotime($form->date_created);
			$diff_hours = ($now_timestamp - $cdate_timestamp) / 3600;

			if(trim(self::$uri, '/') === $form->token) {
				Module::setName($form->module);

				if(intval($diff_hours) < 12) {
					Form::execute($form->action, $form->form_name, $form->item_id);
				} else {
					$error_message = __('Current form is already inactive. Reload the page and try again');

					Server::answer(null, 'error', $error_message, 409);
				}

				exit;
			}
		}

		return false;
	}

	private static function check404() {
		if(empty(self::$route)) {
			Module::setName('Public');

			if(str_starts_with(Request::$uri, '/admin')) {
				Module::setName('Admin');
			}

			self::$route['controller'] = 'Error';
			self::$route['action'] = 'get404';
			self::$route['is_public'] = true;
			self::$route['breadcrumbs'] = [];
		}
	}

	private static function setController() {
		$controller_class = Path::class('controller') . '\\' . ucfirst(self::$route['controller']);

		if(class_exists($controller_class)) {
			$controller_action = self::$route['action'];

			if(method_exists($controller_class, $controller_action)) {
				$controller = new $controller_class;
				$controller->$controller_action();
			} else {
				throw new \Exception(sprintf('Action %s does not exist in %s', $controller_action, $controller_class));
			}
		} else {
			throw new \Exception(sprintf('Controller %s does not exist', $controller_class));
		}

		return true;
	}
}
