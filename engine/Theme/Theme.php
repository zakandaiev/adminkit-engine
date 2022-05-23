<?php

namespace Engine\Theme;

use Engine\Path;
use Engine\View;

class Theme {
	const PART_DIR = 'Part';

	const RULES_NAME_FILE = [
		'header'	=> 'header-%s',
		'footer'	=> 'footer-%s',
		'sidebar'	=> 'sidebar-%s',
		'widget'	=> 'widget-%s',
		'menu'	=> 'menu-%s',
		'breadcrumbs'	=> 'breadcrumbs-%s',
		'pagination'	=> 'pagination-%s',
	];

	private static $theme_path;
	private static $theme_page_templates = [];

	public static function header($name = '', $data = []) {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function footer($name = '', $data = []) {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function sidebar($name = '', $data = []) {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function widget($name = '', $data = []) {
		$name = (string) $name;
		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function menu($name, $data = []) {
		$data[__FUNCTION__] = Menu::get($name);

		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function breadcrumbs($name = '', $data = []) {
		$data[__FUNCTION__] = Breadcrumb::get();
		$data['options'] = Breadcrumb::getOptions();

		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
		Template::load($file);
	}

	public static function pagination($name = '', $data = []) {
		$data[__FUNCTION__] = Pagination::getInstance();

		$file = self::detectNameFile($name, __FUNCTION__);
		$file = self::PART_DIR . '/' . $file;

		View::setData($data);
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

	public static function path() {
		return !empty(self::$theme_path) ? self::$theme_path : Path::file('view');
	}

	public static function pageTemplates() {
		if(!empty(self::$theme_page_templates)) {
			return self::$theme_page_templates;
		}

		$path = Path::file('theme');

		foreach(glob($path . '/*.php') as $template) {
			$template_name = file_name($template);

			if($template_name === 'functions' || $template_name === 'home' || $template_name === 'page' || $template_name === 'category') {
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
