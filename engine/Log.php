<?php

namespace Engine;

class Log {
	public static function write($string, $folder = '') {
		return self::saveToFile(self::format($string), $folder);
	}

	private static function saveToFile($string, $folder) {
		$path = Path::file('log');

		if(!empty($folder)) {
			$path .= '/' . trim($folder, '/');
		}

		if(!file_exists($path)) {
			mkdir($path, 0755, true);
		}

		$path .= '/' . date(Define::LOG_FILENAME) . '.' . Define::LOG_EXTENSION;

		return file_put_contents($path, $string, FILE_APPEND | LOCK_EX);
	}

	private static function format($string) {
		if(is_array($string)) {
			$string = json_encode($string);
		} else if(is_bool($string)) {
			$string = $string === true ? 'true' : 'false';
		} else if(!is_string($string)) {
			$string = strval($string);
		}

		$string = '[' . date('H:i:s') . '] - ' . $string . PHP_EOL;

		return $string;
	}
}
