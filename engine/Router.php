<?php

namespace Engine;

use Engine\Database\Statement;

class Router {
	public static $route = [];

	public static function initialize() {
		self::checkRoutes();
		self::checkForm();
		self::check404();
		self::setController();
	}

	private static function checkRoutes() {
		foreach(Module::list() as $module) {
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
		Module::setName($module);

		if(strtolower(trim($route['method'] ?? '')) === Request::$method && self::isRouteMatched($route['uri'])) {
			foreach($route as $key => $value) {
				self::$route[$key] = $value;
			}

			Module::loadHooks();
			Module::setName($module);

			return true;
		}

		Module::setName(null);

		self::$route = [];

		return false;
	}

	private static function isRouteMatched($route) {
		$parameters = [];

		self::$route['parameters'] = $parameters;

		if($route === '/' && Request::$uri_clean === '/') {
			return true;
		}

		$route = ($route === '/') ? $route : rtrim($route ?? '', '/');
		$uri = (Request::$uri_clean === '/') ? Request::$uri_clean : rtrim(Request::$uri_clean ?? '', '/');

		$route_parts = explode('/', $route);
		array_shift($route_parts);
		$uri_parts = Request::$uri_parts;

		if(Language::has($uri_parts[0])) {
			Language::setCurrent($uri_parts[0]);
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
				$found_variable = ltrim($route_part ?? '', '$');
				$parameters[$found_variable] = $uri_parts[$__i__];
			} else if($route_parts[$__i__] !== $uri_parts[$__i__]) {
				return false;
			}
		}

		self::$route['parameters'] = $parameters;

		return true;
	}

	private static function checkForm() {
		if(Request::$method !== 'post') {
			return false;
		}

		$statement = new Statement('SELECT * FROM {form}');

		$forms = $statement->execute()->fetchAll();

		if(empty($forms)) {
			return false;
		}

		$timestamp_now = time();

		foreach($forms as $form) {
			$timestamp_created = strtotime($form->date_created);
			$timestamp_diff = $timestamp_now - $timestamp_created;

			if(trim(Request::$uri_clean ?? '', '/') === $form->token) {
				Module::setName($form->module);

				if($timestamp_diff < LIFETIME['form']) {
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

			if(Request::$method !== 'get') {
				Server::answer(null, 'error', __('Request not found'), 404);
			}

			self::$route['method'] = Request::$method;
			self::$route['uri'] = Request::$uri;
			self::$route['controller'] = 'Error';
			self::$route['action'] = 'get404';
			self::$route['is_public'] = true;
			self::$route['parameters'] = [];
			self::$route['breadcrumbs'] = [];

			return true;
		}

		return false;
	}

	private static function setController() {
		if(is_closure(self::$route['controller'])) {
			self::$route['controller'](self::$route);
			return true;
		}

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
