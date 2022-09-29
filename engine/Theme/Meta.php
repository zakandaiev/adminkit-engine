<?php

namespace Engine\Theme;

use Engine\Engine;
use Engine\Module;
use Engine\Request;

class Meta {
	private static $meta = [];

	public static function get($key, $page_obj = null) {
		if(isset(self::$meta[$key])) {
			return self::$meta[$key];
		}

		$value = self::$key($page_obj);

		self::$meta[$key] = $value;

		return $value;
	}

	public static function getAll() {
		return self::$meta;
	}

	private static function no_index_no_follow($page) {
		$no_index_no_follow = '';

		if(site('no_index_no_follow') || $page->no_index_no_follow) {
			$no_index_no_follow = '<meta name="robots" content="noindex, nofollow">';
		}

		return $no_index_no_follow;
	}

	private static function title($page) {
		$page_title = $page->title . ' &#8212; ' . site('name');

		if(Module::get('name') === 'Admin' || Module::get('extends') === 'Admin') {
			$page_title = $page->title . ' &lsaquo; ' . __('Admin panel') . ' &#8212; ' . site('name');
		}

		return $page_title;
	}

	private static function seo_image($page) {
		return $page->seo_image ?? site('logo_public');
	}

	private static function seo_description($page) {
		return $page->seo_description ?? site('name') . '. ' . site('description');
	}

	private static function seo_keywords($page) {
		return $page->seo_keywords ?? trim(preg_replace('/[\s\.;]+/', ',', self::get('seo_description', $page)), ',');
	}

	private static function author() {
		return Engine::AUTHOR;
	}

	private static function locale() {
		return site('language_current') . '_' . lang(site('language_current'), 'region');
	}

	private static function setting() {
		return '
			<script>
				const BASE_URL = "' . site('url') . '";
				const SETTING = {
					language: "' . site('language_current') . '",
					csrf: {
						key: "' . COOKIE_KEY['csrf'] . '",
						token: "' . Request::$csrf . '"
					},
					pagination_limit: ' . site('pagination_limit') . '
				};
			</script>
		';
	}

	private static function analytics_gtag() {
		$analytics_gtag = '';

		if(!empty(site('analytics_gtag'))) {
			$analytics_gtag = '
				<script async src="https://www.googletagmanager.com/gtag/js?id=' . site('analytics_gtag') . '"></script>
				<script>
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag("js", new Date());
					gtag("config", "' . site('analytics_gtag') . '");
				</script>
			';
		}

		return $analytics_gtag;
	}

	private static function favicon() {
		$favicon = '
			<link rel="icon" type="image/x-icon" sizes="any" href="' . Asset::url() . '/favicon.ico">
			<link rel="icon" type="image/png" href="' . Asset::url() . '/favicon.png">
			<link rel="icon" type="image/svg+xml" href="' . Asset::url() . '/favicon.svg">
			<link rel="apple-touch-icon" href="' . Asset::url() . '/favicon.png">
		';

		if(empty(site('icon'))) {
			return $favicon;
		}

		switch(file_extension(site('icon'))) {
			case 'ico': {
				$favicon = '<link rel="icon" type="image/x-icon" sizes="any" href="' . site('url') . '/' . site('icon') . '">';
				break;
			}
			case 'png': {
				$favicon = '
					<link rel="icon" type="image/png" href="' . site('url') . '/' . site('icon') . '">
					<link rel="apple-touch-icon" href="' . site('url') . '/' . site('icon') . '">
				';
				break;
			}
			case 'svg': {
				$favicon = '<link rel="icon" type="image/svg+xml"" href="' . site('url') . '/' . site('icon') . '">';
				break;
			}
		}

		return $favicon;
	}

	private static function alt_languages() {
		$languages = site('languages');

		$output = '<link rel="alternate" href="' . site('url') . '" hreflang="x-default">';

		foreach($languages as $language) {
			if(site('language_current') !== $language['key']) {
				$output .= '<link rel="alternate" href="' . site('url') . '/' . $language['key'] . '" hreflang="' . $language['key'] . '">';
			}
		}

		return $output;
	}

	private static function meta_og($page) {
		$page->name = site('name');
		$page->locale = self::locale();
		$page->permalink = site('permalink');
		$page->title = self::title($page);
		$page->seo_description = self::seo_description($page);
		$page->seo_keywords = self::seo_keywords($page);
		$page->seo_image = site('url') . '/' . self::seo_image($page);

		return '
			<meta property="og:type" content="website">
			<meta property="og:site_name" content="' . $page->name . '">
			<meta property="og:locale" content="' . $page->locale . '">
			<meta property="og:url" content="' . $page->permalink . '">
			<meta property="og:title" content="' . $page->title . '">
			<meta property="og:description" content="' . $page->seo_description . '">
			<meta property="og:keywords" content="' . $page->seo_keywords . '">
			<meta property="og:image" content="' . $page->seo_image . '">
		';
	}

	private static function meta_twitter($page) {
		$page->permalink = site('permalink');
		$page->title = self::title($page);
		$page->seo_description = self::seo_description($page);
		$page->seo_image = site('url') . '/' . self::seo_image($page);

		return '
			<meta property="twitter:card" content="summary">
			<meta property="twitter:url" content="' . $page->permalink . '">
			<meta property="twitter:title" content="' . $page->title . '">
			<meta property="twitter:description" content="' . $page->seo_description . '">
			<meta property="twitter:image" content="' . $page->seo_image . '">
		';
	}

	public static function all($page_obj) {
		$page = clone $page_obj;

		$page->title = self::title($page);
		$page->charset = site('charset');
		$page->author = self::author();

		$page->seo_description = self::seo_description($page);
		$page->seo_keywords = self::seo_keywords($page);
		$page->seo_image = site('url') . '/' . self::seo_image($page);

		$page->meta_og = self::meta_og($page);
		$page->meta_twitter = self::meta_twitter($page);

		$page->permalink = site('permalink');

		$page->alt_languages = self::alt_languages();
		$page->favicon = self::favicon();
		$page->setting = self::setting();
		$page->analytics_gtag = self::analytics_gtag();

		$meta = self::no_index_no_follow($page);
		$meta .= '
			<title>' . $page->title . '</title>

			<meta charset="' . $page->charset . '">
			<meta name="author" content="' . $page->author . '">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">

			<meta name="description" content="' . $page->seo_description . '">
			<meta name="keywords" content="' . $page->seo_keywords . '">

			' . $page->meta_og . '
			' . $page->meta_twitter . '

			<link rel="canonical" href="' . $page->permalink . '">

			<link rel="image_src" href="' . $page->seo_image . '">

			' . $page->alt_languages . '
			' . $page->favicon . '
			' . $page->setting . '
			' . $page->analytics_gtag . '
		';

		return $meta;
	}
}
