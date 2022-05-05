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

	public static function header_meta($page) {
		$meta = '';

		if(site('no_index_no_follow') || $page->no_index_no_follow) {
			$meta = '<meta name="robots" content="noindex, nofollow">' . PHP_EOL;
		}

		$page->title = $page->title . ' | ' . site('name');

		$meta .= '
			<title>' . $page->title . '</title>

			<meta charset="' . site('charset') . '">
			<meta name="author" content="' . Define::AUTHOR . '">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no">

			<link rel="canonical" href="' . site('permalink') . '">

			<link rel="image_src" href="' . site('url') . '/' . $page->seo_image . '">

			<meta name="description" content="' . $page->seo_description . '">
			<meta name="keywords" content="' . $page->seo_keywords . '">

			<meta property="og:type" content="website">
			<meta property="og:locale" content="' . lang(site('language_current'), 'region') . '">
			<meta property="og:url" content="' . site('permalink') . '">
			<meta property="og:title" content="' . $page->title . '">
			<meta property="og:description" content="' . $page->seo_description . '">
			<meta property="og:keywords" content="' . $page->seo_keywords . '">
			<meta property="og:image" content="' . site('url') . '/' . $page->seo_image . '">

			<meta property="twitter:card" content="summary">
			<meta property="twitter:url" content="' . site('permalink') . '">
			<meta property="twitter:title" content="' . $page->title . '">
			<meta property="twitter:description" content="' . $page->seo_description . '">
			<meta property="twitter:image" content="' . site('url') . '/' . $page->seo_image . '">

			<link rel="icon" href="' . Asset::url() . '/favicon.ico" sizes="any">
			<link rel="icon" href="' . Asset::url() . '/favicon.svg" type="image/svg+xml">
			<link rel="apple-touch-icon" href="' . Asset::url() . '/apple-touch-icon.png">

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
		
		return $meta;
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
