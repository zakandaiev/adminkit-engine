<?php

namespace Engine;

class Language {
	private static $is_loaded = false;
	private static $language = [];

	public static function translate($key) {
		if(!self::$is_loaded) {
			self::load();
		}

		return self::$language[$key] ?? null;
	}

	public static function load() {
		$path_lang = ROOT_DIR . '/module/Admin/Language/ru@ru_RU@Русский.ini';

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
}
