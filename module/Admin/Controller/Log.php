<?php

namespace Module\Admin\Controller;

class Log extends AdminController {
	public function getAll() {
		$logs = \Engine\Log::getAll();

		$data['logs'] = $logs;

		$this->view->setData($data);
		$this->view->render('log/all');
	}

	public function get() {
		$log_id = $this->route['parameters']['id'];

		$log = \Engine\Log::get($log_id);

		$data['log'] = $log;

		if(!isset($data['log']->body)) {
			$this->view->error('404');
		}

		$this->view->setData($data);
		$this->view->render('log/single');
	}
}
