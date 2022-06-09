<?php

namespace Engine;

class Cache {
	const CACHE_KEY = [
		'data' => 'data',
		'expires' => 'expires'
	];

	public static function set($key, $data, $lifetime = null) {
		$path = Path::file('cache');

		if(!file_exists($path)) {
			mkdir($path, 0660, true);
		}

		$path = $path . '/' . md5($key) . '.' . trim(trim(Define::CACHE_EXTENSION), '.');

		$content[self::CACHE_KEY['data']] = $data;
		$content[self::CACHE_KEY['expires']] = time() + intval($lifetime ?? Define::LIFETIME['cache']);

		try {
			file_put_contents($path, serialize($content));
		}
		catch(\Exception $error) {
			throw new \Exception(sprintf('Cache error: %s', $error->getMessage()));
		}

		return true;
	}

	public static function get($key) {
		$path = Path::file('cache') . '/' . md5($key) . '.' . trim(trim(Define::CACHE_EXTENSION), '.');

		if(file_exists($path)) {
			$content = unserialize(file_get_contents($path));

			if(time() <= $content[self::CACHE_KEY['expires']]) {
				return $content[self::CACHE_KEY['data']];
			}
		}

		return false;
	}

	public static function delete($key) {
		$path = Path::file('cache') . '/' . md5($key) . '.' . trim(trim(Define::CACHE_EXTENSION), '.');

		if(!file_exists($path)) {
			return false;
		}

		unlink($path);

		return true;
	}

	public static function deleteAll() {
		$path = Path::file('cache');

		if(!file_exists($path)) {
			return false;
		}

		foreach(scandir($path) as $file) {
			if(in_array($file, ['.', '..'], true)) continue;

			if(file_extension($file) !== trim(trim(Define::CACHE_EXTENSION), '.')) continue;

			unlink($path . '/' . $file);
		}

		return true;
	}
}
