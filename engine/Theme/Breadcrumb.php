<?php

namespace Engine\Theme;

class Breadcrumb {
	private $crumbs = [];

	public static function add($name, $url = '') {
		$crumb = new \stdClass();

		$crumb->name = trim(strval($name));
		$crumb->url = trim(trim(strval($url)), '/');

		self::$crumbs = $crumb;

		return true;
	}

	public static function get() {
		return self::$crumbs;
	}

	public static function set($array) {
		if(!is_array($array)) {
			return false;
		}

		self::$crumbs = $array;

		return true;
	}

	public static function render($render_homepage, $homepage_title = 'Homepage') {
		$output = '<nav class="breadcrumbs">';

		foreach(self::$crumbs as $crumb) {
			if(!empty($crumb->url)) {
				$output .= '<a href="' . site('url_language') . '/' . $crumb->url . '" class="breadcrumbs__item">' . $crumb->name . '</a>';
			} else {
				$output .= '<span class="breadcrumbs__item">' . $crumb->name . '</span>';
			}
		}

		$output .= '</nav>';

		return $output;
	}
}
