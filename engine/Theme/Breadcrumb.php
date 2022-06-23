<?php

namespace Engine\Theme;

class Breadcrumb {
	private static $crumbs = [];
	private static $options = [
		'render_homepage' => false,
		'homepage_name' => '',
		'homepage_url' => '',
		'separator' => ''
	];

	public static function add($name, $url = '') {
		$crumb = new \stdClass();

		$crumb->name = trim(strval($name));
		$crumb->url = trim(trim(strval($url)), '/');

		self::$crumbs[] = $crumb;

		return true;
	}

	public static function edit($key, $name = null, $url = null) {
		if(!isset(self::$crumbs[$key])) {
			return false;
		}

		if(!empty($name)) {
			self::$crumbs[$key]->name = trim(strval($name ?? ''));
		}

		if(!empty($url)) {
			self::$crumbs[$key]->url = trim(trim(strval($url ?? '')), '/');
		}

		return true;
	}

	public static function get() {
		return self::$crumbs;
	}

	public static function set($array) {
		if(!is_array($array)) {
			return false;
		}

		self::$crumbs = [];

		foreach($array as $value) {
			if(is_object($value)) {
				self::add($value->name, @$value->url);
				continue;
			}

			$values = explode('@', $value, 2);

			self::add($values[0], @$values[1]);
		}

		return true;
	}

	public static function getOption($key) {
		return self::$options[$key] ?? null;
	}

	public static function getOptions() {
		return self::$options;
	}

	public static function setOption($key, $value) {
		if(!isset(self::$options[$key])) {
			return false;
		}

		self::$options[$key] = $value;

		return true;
	}

	public static function render() {
		$output = '<nav class="breadcrumbs">';
		$separator = '<span class="breadcrumbs__separator">' . self::$options['separator'] . '</span>';

		if(self::$options['render_homepage']) {
			$homepage_url = !empty(self::$options['homepage_url']) ? '/' . trim(self::$options['homepage_url'] ?? '', '/') : '';
			$output .= '<a href="' . site('url_language') . $homepage_url . '" class="breadcrumbs__item">' . self::$options['homepage_name'] . '</a>';
			$output .= $separator;
		}

		foreach(self::$crumbs as $key => $crumb) {
			if(!empty($crumb->url)) {
				$output .= '<a href="' . site('url_language') . '/' . $crumb->url . '" class="breadcrumbs__item">' . $crumb->name . '</a>';
			} else {
				$output .= '<span class="breadcrumbs__item">' . $crumb->name . '</span>';
			}

			if(isset(self::$crumbs[$key + 1])) {
				$output .= $separator;
			}
		}

		$output .= '</nav>';

		return $output;
	}
}
