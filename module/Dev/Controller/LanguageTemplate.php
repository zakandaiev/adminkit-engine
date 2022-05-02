<?php

namespace Module\Dev\Controller;

use Engine\Server;

class LanguageTemplate extends \Engine\Controller {
	public function __construct() {
		parent::__construct();
	}

	public function generate() {
		$module_name = $this->route['parameters']['module_name'];
		$module_name = filter_var($module_name, FILTER_SANITIZE_STRING) ?? null;

		if(!$module_name) {
			Server::answer(null, 'error', 'Enter module name');
			exit;
		}

		debug($module_name);
		exit;

		Server::answer(null, 'success', 'Done');
	}
}
