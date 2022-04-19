<?php

namespace Engine;

class Language {
	private static $language;

	public static function get($section) {
		return self::$language->{$section} ?? null;
	}

	public static function getAll() {
		return self::$language ?? null;
	}

	public static function initialize() {
		$lang = new \stdClass();

		if(empty(Module::get('languages'))) {
			return $lang;
		}

		if(!Module::get('languages')[Setting::get('main')->language]['enabled']) {
			return $lang;
		}

		$path_lang_dir = Path::file('language');

		if(!file_exists($path_lang_dir)) {
			return $lang;
		}

		foreach(scandir($path_lang_dir) as $section) {
			if(in_array($section, ['.', '..'], true)) continue;

			if(file_extension($section) !== 'ini') continue;

			$file_section = $path_lang_dir . '/' . $section;

			$content_lang = parse_ini_file($file_section, true);

			if(!$content_lang) {
				$lang->{substr($section, 0, -4)} = null;
				continue;
			}

			$lang->{substr($section, 0, -4)} = $content_lang;
		}

		self::$language = json_decode(json_encode($lang));
		
		return true;
	}

	public static function load($file_name) {
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

		return $lang;
	}
}