<?php

namespace Engine\Theme;

use Engine\Define;
use Engine\Path;

class Asset {
	const EXTENSION_MASK = [
		'js' => '<script src="%s"%s></script>',
		'css' => '<link href="%s" rel="stylesheet"%s>'
	];

	private static $container = [];
	private static $asset_url;

	private static function add($extension, $filename, $attributes = '') {
		$file_path = Path::file('asset') . '/' . $filename . '.' . $extension;

		if(is_file($file_path)) {
			self::$container[$extension][] = [
				'file' => Path::url('asset') . '/' . $filename . '.' . $extension,
				'attributes' => $attributes
			];

			return true;
		}

		return false;
	}

	public static function css($asset, $attributes = null) {
		return self::add(__FUNCTION__, $asset, $attributes);
	}

	public static function js($asset, $attributes = null) {
		return self::add(__FUNCTION__, $asset, $attributes);
	}

	public static function render($extension) {
		$assets = self::$container[$extension] ?? [];

		if(empty($assets)) {
			return false;
		}

		$output = '';

		foreach($assets as $asset) {
			$output .= sprintf(
				self::EXTENSION_MASK[$extension],
				$asset['file'] . '?version=' . Define::VERSION,
				$asset['attributes']
			) . PHP_EOL;
		}

		return $output;
	}

	public static function url() {
		return !empty(self::$asset_url) ? self::$asset_url : Path::url('asset');
	}
}
