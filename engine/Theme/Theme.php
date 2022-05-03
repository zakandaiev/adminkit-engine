<?php

namespace Engine\Theme;

use Engine\Define;
use Engine\Path;
use Engine\View;
use Engine\Request;
use Engine\Setting;

class Theme {
	const PART_DIR = 'Part';

	const RULES_NAME_FILE = [
		'header'	=> 'header-%s',
		'footer'	=> 'footer-%s',
		'sidebar'	=> 'sidebar-%s',
		'widget'	=> 'widget-%s',
	];

	private static $theme_path;
	private static $theme_page_templates = [];

	public static function header($name = '') {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		Template::load($file);
	}

	public static function footer($name = '') {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		Template::load($file);
	}

	public static function sidebar($name = '') {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		Template::load($file);
	}

	public static function widget($name = '') {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		Template::load($file);
	}

	public static function block($name = '', $data = []) {
		$name = (string) $name;

		if($name !== '') {
			$file = self::PART_DIR . '/' . $name;

			View::setData($data);
			Template::load($file);
		}
	}

	public static function pagination($pagination = []) {
		$data['pagination'] = $pagination ?? [];

		$file = self::PART_DIR . '/' . __FUNCTION__;

		View::setData($data);
		Template::load($file);
	}

	public static function title($title = '') {
		if(empty($title)) {
			$title = 'Admin';
		}
		
		return $title . ' | ' . site('name');
	}

	public static function meta() {
		$meta = [];

		$meta_noindex = '<meta name="robots" content="noindex, nofollow">';

		$js_setting = '
			<script>
				let SETTING = {
					language: "' . site('language') . '",
					csrf: {
						key: "' . Define::COOKIE_KEY['csrf'] . '",
						token: "' . Request::$csrf . '"
					}
				};
			</script>
		';

		$meta[] = $meta_noindex;
		$meta[] = $js_setting;
		
		$output = '';

		foreach($meta as $item) {
			$output .= $item;
		}

		return $output;
	}

	public static function path() {
		return !empty(self::$theme_path) ? self::$theme_path : Path::file('view');
	}

	public static function pageTemplates() {
		if(!empty(self::$theme_page_templates)) {
			return self::$theme_page_templates;
		}

		$path = Path::file('view_public');
		
		foreach(glob($path . '/*.php') as $template) {
			$template_name = file_name($template);

			if($template_name === 'function' || $template_name === 'home' || $template_name === 'page' || $template_name === 'category') {
				continue;
			}

			self::$theme_page_templates[] = $template_name;
		}

		return self::$theme_page_templates;
	}

	private static function detectNameFile($name, $function) {
		return empty(trim($name)) ? $function : sprintf(self::RULES_NAME_FILE[$function], $name);
	}
}
