<?php

namespace Engine;

class Language {
	private static $language;

	public static function initialize() {
		putenv('LANG=en');
		putenv('LANGUAGE=en');

		setlocale(LC_ALL, 'en');

		textdomain('en');
		bindtextdomain('en', 'language');
		bind_textdomain_codeset('en', 'UTF-8');

		return true;
	}

	public static function get($file_name) {
		return self::$language->{$file_name} ?? null;
	}

	public static function load($file_name) {
		$lang = self::get($file_name);

		if($lang) {
			return $lang;
		}

		$lang = new \stdClass();

		$path_lang = Path::file('language') . '/' . $file_name . '.ini';

		if(!file_exists($path_lang)) {
			return $lang;
		}

		$content_lang = parse_ini_file($path_lang, true);

		if(!$content_lang) {
			return $lang;
		}

		$lang = json_decode(json_encode($content_lang));

		if(!self::$language) {
			self::$language = new \stdClass();
		}
		self::$language->{$file_name} = $lang;

		return $lang;
	}
}
