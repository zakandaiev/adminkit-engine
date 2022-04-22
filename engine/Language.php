<?php

namespace Engine;

class Language {
	private static $language;

	public static function get($file_name) {
		return self::$language->{$file_name} ?? null;
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

		foreach(scandir($path_lang_dir) as $file_name) {
			if(in_array($file_name, ['.', '..'], true)) continue;

			if(file_extension($file_name) !== 'ini') continue;

			$file = $path_lang_dir . '/' . $file_name;

			$content_lang = parse_ini_file($file, true);

			if(!$content_lang) {
				$lang->{substr($file_name, 0, -4)} = null;
				continue;
			}

			$lang->{substr($file_name, 0, -4)} = $content_lang;
		}

		self::$language = json_decode(json_encode($lang));
		
		return true;
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
