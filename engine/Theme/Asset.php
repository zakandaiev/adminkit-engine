<?php

namespace Engine\Theme;

use Engine\Path;

class Asset {
	const JS_SCRIPT_MASK = '<script %s src="%s"></script>';
	const CSS_LINK_MASK  = '<link %s rel="stylesheet" href="%s">';

	private static $container = [];
	private static $asset_path;
	private static $asset_url;

	private static function add($extension, $filename, $attributes = '') {
		$file_path = self::path() . '/' . $filename . '.' . $extension;

		if(is_file($file_path)) {
			self::$container[$extension][] = [
				'file' => self::url() . '/' . $filename . '.' . $extension,
				'attributes' => $attributes
			];

			return true;
		}

		return false;
	}

	public static function css($asset, $attributes = '') {
		return self::add(__FUNCTION__, $asset, $attributes);
	}

	public static function js($asset, $attributes = '') {
		return self::add(__FUNCTION__, $asset, $attributes);
	}

	public static function render($extension) {
		$assets = isset(self::$container[$extension]) ? self::$container[$extension] : [];

		if(!empty($assets)) {
			$renderMethod = 'render' . ucfirst($extension);
			
			return self::$renderMethod($assets);
		}
	}

	private static function renderJs($list) {
		$output = '';

		foreach($list as $item) {
			$output .= sprintf(
				self::JS_SCRIPT_MASK,
				$item['attributes'],
				$item['file']
			) . PHP_EOL;
		}

		return $output;
	}

	private static function renderCss($list) {
		$output = '';

		foreach($list as $item) {
			$output .= sprintf(
				self::CSS_LINK_MASK,
				$item['attributes'],
				$item['file']
			) . PHP_EOL;
		}

		return $output;
	}

	public static function path() {
		return !empty(self::$asset_path) ? self::$asset_path : Path::file('asset');
	}

	public static function url() {
		return !empty(self::$asset_url) ? self::$asset_url : Path::url('asset');
	}
}
