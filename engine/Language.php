<?php

namespace Engine;

class Language {
	private static $language = [];
	private static $translation = [];
	private static $loaded_modules = [];

	public static function get($key, $language = null) {
		return Module::get('languages')[$language ?? self::current()][$key] ?? null;
	}

	public static function getFull($language = null) {
		return Module::get('languages')[$language ?? self::current()] ?? null;
	}

	public static function has($language) {
		return isset(Module::get('languages')[$language]);
	}

	public static function getAll() {
		return Module::get('languages');
	}

	public static function translate($key) {
		$module_name = Module::get('name');

		if(!in_array($module_name, self::$loaded_modules)) {
			self::$loaded_modules[] = $module_name;
			self::loadTranslations($module_name);
		}

		return (DEBUG['is_enabled'] ? DEBUG['lang_wrap'] : '') . (self::$translation[$key] ?? $key) . (DEBUG['is_enabled'] ? DEBUG['lang_wrap'] : '');
	}

	public static function current() {
		$language_from_cookie = Session::hasCookie(COOKIE_KEY['language']) ? Session::getCookie(COOKIE_KEY['language']) : null;

		if(!empty($language_from_cookie) && Language::has($language_from_cookie)) {
			$language = Session::getCookie(COOKIE_KEY['language']);
		} else {
			$language = Setting::get('main')->language ?? null;
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

	public static function getModuleLanguages($module) {
		$path = Path::file('language', $module);

		$languages = [];

		if(!file_exists($path)) {
			return $languages;
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

			$languages[$language_key] = $lang;
		}

		return $languages;
	}

	private static function loadTranslations($module) {
		$path_lang = Path::file('language', $module) . '/' . self::get('file_name');

		if(!is_file($path_lang)) {
			return false;
		}

		$content_lang = parse_ini_file($path_lang);

		if(empty($content_lang)) {
			return false;
		}

		self::$translation = array_merge(self::$translation, $content_lang);

		return true;
	}
}
