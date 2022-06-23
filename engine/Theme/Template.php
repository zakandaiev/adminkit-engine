<?php

namespace Engine\Theme;

use Engine\Module;
use Engine\View;

class Template {
	public static function load($template, $is_required = true, $module = null) {
		$template_path = Theme::path($module) . '/' . $template . '.php';

		if(!is_file($template_path) && Module::get('extends')) {
			$template_path = Theme::path(Module::get('extends')) . '/' . $template . '.php';
		}

		if(!is_file($template_path)) {
			if($is_required) {
				throw new \Exception(sprintf('Template %s not found in %s.', $template, $template_path));
			} else {
				return false;
			}
		}

		extract(View::getData());

		ob_start();
		ob_implicit_flush(0);

		try {
			require $template_path;
		} catch(\Exception $e){
			ob_end_clean();
			throw $e;
		}

		echo ob_get_clean();

		return true;
	}
}
