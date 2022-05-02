<?php

namespace Engine;

class Language {
	private static $is_loaded = false;
	private static $language = [];

	public static function translate($key) {
		if(!self::$is_loaded) {
			self::load();
		}

		return self::$language[$key] ?? $key;
	}

	public static function load() {
		$path_lang = ROOT_DIR . '/module/Admin/Language/' . @Module::get('languages')[self::current()]['filename'] . '.ini';

		if(!file_exists($path_lang)) {
			return false;
		}

		$content_lang = parse_ini_file($path_lang);

		if(!$content_lang) {
			return false;
		}

		self::$language = $content_lang;
		self::$is_loaded = true;

		return true;
	}

	public static function current() {
		$language = Setting::get('main')->language;
		$module_languages = Module::get('languages') ?? [];

		if(Session::hasCookie(Define::COOKIE_KEY['language']) && !empty(Session::getCookie(Define::COOKIE_KEY['language'])) && array_key_exists(Session::getCookie(Define::COOKIE_KEY['language']), $module_languages)) {
			$language = Session::getCookie(Define::COOKIE_KEY['language']);
		}
		
		return $language;
	}

	public static function setCookie($language) {
		$cookie_key = Define::COOKIE_KEY['language'];
		
		Session::setCookie($cookie_key, $language);

		return true;
	}
}
