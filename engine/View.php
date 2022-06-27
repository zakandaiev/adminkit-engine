<?php

namespace Engine;

use Engine\Theme\Theme;
use Engine\Theme\Template;

class View {
	private static $data = [];

	public function render($template, $is_required = true) {
		$extends = Module::get('extends');
		if($extends) {
			$extends_origin = Module::$name;
			Module::setName($extends);
			Template::load('functions', false, $extends);
			Module::setName($extends_origin);
		}

		Template::load('functions', false);

		Template::load($template, $is_required);
	}

	public function error($code) {
		http_response_code($code);

		$data = $this->getData();
		$data['page']->title = __('Page not found');

		$this->setData($data);

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
