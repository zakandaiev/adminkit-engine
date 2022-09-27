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
			mkdir($path, 0755, true);
		}

		$path .= '/' . date(LOG['file_mask']) . '.' . LOG['extension'];

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

			$scdir = scandir($dir);

			foreach($scdir as $log_name) {
				if(in_array($log_name, ['.', '..'])) {
					continue;
				}

				$file = $dir . '/' . $log_name;

				if(is_dir($file)) {
					$result[$log_name] = dirToArray($file);
				} else if(file_extension($log_name) === LOG['extension']) {
					$result[] = file_name($log_name);
				}
			}

			uasort($result, function ($log1, $log2) {
				if(is_string($log1) && is_array($log2)) {
					return 1;
				}

				return 0;
			});

			return $result;
		}

		self::$logs = dirToArray(Path::file('log'));

		return self::$logs;
	}

	public static function get($id) {
		$log = new \stdClass();
		$log_id = str_replace('@', '/', trim($id ?? '', '/'));

		$path = Path::file('log') . '/' . $log_id . '.' . LOG['extension'];

		if(!is_file($path)) {
			return $log;
		}

		$log->name = $log_id;
		$log->body = file_get_contents($path);

		return $log;
	}
}
