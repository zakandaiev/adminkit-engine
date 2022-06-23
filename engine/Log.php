<?php

namespace Engine;

class Log {
	private static $logs = [];

	public static function write($string, $folder = '') {
		return self::saveToFile(self::format($string), $folder);
	}

	private static function saveToFile($string, $folder) {
		$path = Path::file('log');

		if(!empty($folder)) {
			$path .= '/' . trim($folder ?? '', '/');
		}

		if(!file_exists($path)) {
			mkdir($path, 0660, true);
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

	public static function getAll() {
		if(!empty(self::$logs)) {
			return self::$logs;
		}

		function dirToArray($dir) {
			$result = [];

			if(!file_exists($dir)) {
				return [];
			}

			$cdir = scandir($dir);

			foreach($cdir as $key => $value) {
				if(in_array($value, ['.', '..'])) {
					continue;
				}

				$file = $dir . '/' . $value;

				if(is_dir($file)) {
					$result[$value] = dirToArray($file);
				} else if(file_extension($value) === Define::LOG_EXTENSION) {
					$result[] = file_name($value);
				}
			}

			return $result;
		}

		self::$logs = dirToArray(Path::file('log'));

		arsort(self::$logs);
		foreach(self::$logs as &$log) {
			if(is_array($log)) {
				arsort($log);
			}
		}

		return self::$logs;
	}

	public static function get($id) {
		$log = new \stdClass();
		$log_id = str_replace('@', '/', trim($id ?? '', '/'));

		$path = Path::file('log') . '/' . $log_id . '.' . Define::LOG_EXTENSION;

		if(!file_exists($path)) {
			return $log;
		}

		$log->name = $log_id;
		$log->body = file_get_contents($path);

		return $log;
	}
}
