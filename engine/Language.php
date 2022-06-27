<?php

namespace Engine;

class Language {
	private static $language = [];
	private static $translation = [];
	private static $is_translation_loaded = false;

	public static function initialize() {
		self::loadLanguages();
		self::checkUri();

		return true;
	}

	public static function get($key) {
		return self::$language[$key] ?? null;
	}

	public static function has($key) {
		return isset(self::$language[$key]);
	}

	public static function getAll() {
		return self::$language;
	}

	public static function translate($key) {
		if(!self::$is_translation_loaded) {
			self::loadTranslations();
		}

		return (DEBUG['is_enabled'] ? DEBUG['lang_wrap'] : '') . (self::$translation[$key] ?? $key) . (DEBUG['is_enabled'] ? DEBUG['lang_wrap'] : '');
	}

	public static function current() {
		$language_from_cookie = Session::hasCookie(COOKIE_KEY['language']) ? Session::getCookie(COOKIE_KEY['language']) : null;

		if(!empty($language_from_cookie) && Language::has($language_from_cookie)) {
			$language = Session::getCookie(COOKIE_KEY['language']);
		} else {
			$language = Setting::get('main')->language;
		}

		return $language;
	}

	public static function setCurrent($language) {
		if(!self::has($language)) {
			return false;
		}

		Session::setCookie(COOKIE_KEY['language'], $language);

		return true;
	}

	private static function loadLanguages() {
		$path = Path::file('language');

		if(!file_exists($path)) {
			return false;
		}

		foreach(scandir($path) as $language) {
			if(in_array($language, ['.', '..'], true)) continue;

			if(file_extension($language) !== 'ini') continue;

			@list($language_key, $language_region, $language_name) = explode('@', file_name($language), 3);

			if(empty($language_key) || empty($language_region) || empty($language_name)) {
				continue;
			}

			$lang['key'] = $language_key;
			$lang['region'] = $language_region;
			$lang['name'] = $language_name;
			$lang['file_name'] = $language;

			self::$language[$language_key] = $lang;
		}

		return true;
	}

	private static function loadTranslations() {
		self::$is_translation_loaded = true;

		$path_lang = Path::file('language') . '/' . self::get(self::current())['file_name'];

		if(!file_exists($path_lang)) {
			return false;
		}

		$content_lang = parse_ini_file($path_lang);

		if(empty($content_lang)) {
			return false;
		}

		self::$translation = $content_lang;

		return true;
	}

	private static function checkUri() {
		$uri_parts = explode('/', Request::$uri);

		self::setCurrent(@$uri_parts[1]);

		return true;
	}
}
