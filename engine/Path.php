<?php

namespace Engine;

class Path {
	public static function class($class_name) {
		$module = 'Admin';

		if(!empty(Module::$name)) {
			$module = trim(Module::$name, '/');
		}

		switch(strtolower($class_name)) {
			case 'controller':
				return '\\Module\\' . ucfirst($module) . '\\Controller';
			case 'model':
				return '\\Module\\' . ucfirst($module) . '\\Model';
			case 'view':
				return '\\Module\\' . ucfirst($module) . '\\View';
			case 'form':
				return '\\Module\\' . ucfirst($module) . '\\Form';
			default:
				return null;
		}
	}

	public static function file($section) {
		$module = 'Admin';

		if(!empty(Module::$name)) {
			$module = trim(Module::$name, '/');
		}

		switch(strtolower($section)) {
			case 'config':
				return ROOT_DIR . '/config';
			case 'module':
				return ROOT_DIR . '/module';
			case 'theme':
				return ROOT_DIR . '/theme';
			case 'upload':
				return ROOT_DIR . '/' . trim(Define::UPLOAD_FOLDER, '/');
			case 'controller':
				return ROOT_DIR . '/module/' . $module . '/Controller';
			case 'model':
				return ROOT_DIR . '/module/' . $module . '/Model';
			case 'view': {
				$path = ROOT_DIR . '/module/' . $module . '/View';
				if(Module::$name === 'Public') {
					$path = ROOT_DIR . '/theme/' . Setting::get('theme')->theme;
				}
				return $path;
			}
			case 'asset': {
				$path = ROOT_DIR . '/module/' . $module . '/View/Asset';
				if(Module::$name === 'Public') {
					$path = ROOT_DIR . '/theme/' . Setting::get('theme')->theme . '/Asset';
				}
				return $path;
			}
			case 'form':
				return ROOT_DIR . '/module/' . $module . '/Form';
			case 'language':
				return ROOT_DIR . '/module/' . $module . '/Language/' . Setting::get('main')->language;
			case 'view_public':
				return ROOT_DIR . '/theme/' . Setting::get('theme')->theme;
			default:
				return ROOT_DIR;
		}
	}

	public static function url($section) {
		$url_base = Request::$base;

		$module = 'Admin';

		if(!empty(Module::$name)) {
			$module = trim(Module::$name, '/');
		}

		switch(strtolower($section)) {
			case 'upload':
				return $url_base . '/' . trim(Define::UPLOAD_FOLDER, '');
			case 'theme':
				return $url_base . '/theme';
			case 'asset': {
				$path = $url_base . '/module/' . $module . '/View/Asset';
				if(Module::$name === 'Public') {
					$path = $url_base . '/theme/' . Setting::get('theme')->theme . '/Asset';
				}
				return $path;
			}
			default:
				return $url_base;
		}
	}
}
