<?php

namespace Engine;

use Engine\Theme\Theme;
use Engine\Theme\Template;

class View {
	private static $data = [];

	public function render($template, $is_required = true) {
		$module_name = Module::get('name');
		$module_extends = Module::get('extends');

		if($module_extends) {
			Module::setName($module_extends);
			Template::load('functions', false, $module_extends);
			Module::setName($module_name);
		}

		Template::load('functions', false);

		Template::load($template, $is_required, $module_name);
	}

	public function error($code) {
		http_response_code($code);

		$this->render('Error/' . $code);

		exit;
	}

	public static function getData() {
		return self::$data;
	}

	public static function setData($data) {
		self::$data = $data + self::$data;
	}
}
