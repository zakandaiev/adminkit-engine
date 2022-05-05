<?php

namespace Module\Admin\Model;

class Setting {
	public function getSettings($section) {
		$settings = \Engine\Setting::get($section);
		
		return $settings;
	}	
}
