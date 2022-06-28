<?php

namespace Engine;

class Path {
	public static function class($class_name, $module = null) {
		$module = $module ?? trim(Module::$name ?? '');

		switch(strtolower($class_name ?? '')) {
			case 'controller':
				return '\\Module\\' . ucfirst($module) . '\\Controller';
			case 'model':
				return '\\Module\\' . ucfirst($module) . '\\Model';
			case 'view':
				return '\\Module\\' . ucfirst($module) . '\\View';
			default:
				return null;
		}
	}

	public static function file($section = null, $module = null) {
		$module = $module ?? trim(Module::$name ?? '');

		switch(strtolower($section ?? '')) {
			case 'config':
				return ROOT_DIR . '/config';
			case 'engine':
				return ROOT_DIR . '/engine';
			case 'language':
				return ROOT_DIR . '/language';
			case 'log':
				return ROOT_DIR . '/' . trim(LOG['folder'], '/');
			case 'module':
				return ROOT_DIR . '/module';
			case 'temp': {
				return sys_get_temp_dir();
				// Use below path if there are problems with sys_get_temp_dir() on shared hosting
				$doc_root = $_SERVER['DOCUMENT_ROOT'];
				return substr($doc_root, 0, strpos($doc_root, 'data')) . 'data/tmp';
			}
			case 'cache': {
				return self::file('temp') . '/' . trim(CACHE['folder'], '/');
			}
			case 'theme':
				return ROOT_DIR . '/theme';
			case 'upload':
				return ROOT_DIR . '/' . trim(UPLOAD['folder'], '/');
			case 'controller':
				return ROOT_DIR . '/module/' . $module . '/Controller';
			case 'model':
				return ROOT_DIR . '/module/' . $module . '/Model';
			case 'view': {
				$path = ROOT_DIR . '/module/' . $module . '/View';
				if($module === 'Public') {
					$path = self::file('theme');
				}
				return $path;
			}
			case 'asset': {
				$path = ROOT_DIR . '/module/' . $module . '/View/Asset';
				if($module === 'Public') {
					$path = self::file('theme') . '/Asset';
				}
				return $path;
			}
			case 'filter': {
				$path = ROOT_DIR . '/module/' . $module . '/Filter';
				if($module === 'Public') {
					$path = self::file('theme') . '/Filter';
				}
				return $path;
			}
			case 'form': {
				$path = ROOT_DIR . '/module/' . $module . '/Form';
				if($module === 'Public') {
					$path = self::file('theme') . '/Form';
				}
				return $path;
			}
			case 'mail': {
				$path = ROOT_DIR . '/module/' . $module . '/Mail';
				if($module === 'Public') {
					$path = self::file('theme') . '/Mail';
				}
				return $path;
			}
			case 'custom_fields':
				return ROOT_DIR . '/theme/CustomFields';
			default:
				return ROOT_DIR;
		}
	}

	public static function url($section = null, $module = null) {
		$url_base = Request::$base;

		$module = $module ?? trim(Module::$name ?? '');

		switch(strtolower($section ?? '')) {
			case 'upload':
				return $url_base . '/' . trim(UPLOAD['folder'], '/');
			case 'theme':
				return $url_base . '/theme';
			case 'asset': {
				$path = $url_base . '/module/' . $module . '/View/Asset';
				if($module === 'Public') {
					$path = self::url('theme') . '/Asset';
				}
				return $path;
			}
			default:
				return $url_base;
		}
	}
}
