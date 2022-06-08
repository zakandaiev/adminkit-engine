<?php

namespace Engine\Theme;

use Engine\Module;
use Engine\Path;
use Engine\Router;
use Engine\Setting;

class Asset {
	const EXTENSION_MASK = [
		'js' => '<script src="%s"%s></script>',
		'css' => '<link href="%s" rel="stylesheet"%s>'
	];

	private static $container = [];
	private static $asset_url;
	private static $optimization = [
		'js' => [
			'attributes' => null,
			'routes' => null
		],
		'css' => [
			'attributes' => null,
			'routes' => null
		]
	];

	private static function add($extension, $file_name, $attributes = '', $routes = null) {
		$file_path = Path::file('asset') . '/' . $file_name . '.' . $extension;

		if(is_file($file_path)) {
			self::$container[$extension][] = [
				'file' => $file_name . '.' . $extension,
				'attributes' => $attributes,
				'routes' => $routes
			];

			return true;
		}

		return false;
	}

	public static function css($asset, $attributes = null, $routes = null) {
		return self::add(__FUNCTION__, $asset, $attributes, $routes);
	}

	public static function js($asset, $attributes = null, $routes = null) {
		return self::add(__FUNCTION__, $asset, $attributes, $routes);
	}

	public static function optimization($extension, $attributes = null, $routes = null) {
		self::$optimization[$extension]['attributes'] = $attributes;
		self::$optimization[$extension]['routes'] = $routes;

		return true;
	}

	public static function render($extension) {
		$assets = self::$container[$extension] ?? [];

		if(empty($assets)) {
			return false;
		}

		if(Module::$name === 'Public' && @Setting::get('optimization')->{'group_' . $extension} != 'false') {
			$assets = [
				[
					'file' => $extension . '/' . Setting::get('optimization')->{'group_' . $extension} . '.' . $extension,
					'attributes' => self::$optimization[$extension]['attributes'],
					'routes' => self::$optimization[$extension]['routes']
				]
			];
		}

		$output = '';

		foreach($assets as $asset) {
			if(!self::checkRoute($asset['routes'])) {
				continue;
			}

			$output .= sprintf(
				self::EXTENSION_MASK[$extension],
				Path::url('asset') . '/' . $asset['file'] . '?version=' . Module::get('version'),
				!empty($asset['attributes']) ? ' ' . $asset['attributes'] : ''
			) . PHP_EOL;
		}

		return $output;
	}

	public static function url() {
		return !empty(self::$asset_url) ? self::$asset_url : Path::url('asset');
	}

	public static function get($extension) {
		return self::$container[$extension] ?? [];
	}

	private static function checkRoute($routes = null) {
		if(empty($routes)) {
			return true;
		}

		$routes = is_array($routes) ? $routes : (!empty($routes) ? [$routes] : []);

		$routes = array_map(function($string) {
			return trim(trim(strval($string)), '/');
		}, $routes);

		$route = trim(trim(Router::$route['uri']), '/');

		if(in_array($route, $routes)) {
			return true;
		}

		return false;
	}
}
