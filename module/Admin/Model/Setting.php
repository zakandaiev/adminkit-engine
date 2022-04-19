<?php

namespace Module\Admin\Model;

use Engine\Path;
use Engine\Database\Statement;

class Setting {
	public function getSettings($section) {
		$settings = \Engine\Setting::get($section);
		
		return $settings;
	}

	public function getThemes() {
		$path = Path::file('theme');
		$themes = new \stdClass();

		foreach(scandir($path) as $theme) {
			if(in_array($theme, ['.', '..'], true)) continue;

			$theme_info = $path . '/' . $theme . '/theme.json';

			if(file_exists($theme_info)) {
				$theme_info = json_decode(file_get_contents($theme_info));
			} else {
				continue;
			}

			if(empty($theme_info)) {
				continue;
			}

			$theme_info->key = $theme;
			$theme_info->path = $path . '/' . $theme;
			$theme_info->url = Path::url('theme') . '/' . $theme;
			$themes->{$theme} = $theme_info;
		}

		return $themes;
	}
	
}