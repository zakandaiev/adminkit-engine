<?php

namespace Module\Admin\Controller;

class Dashboard extends AdminController {
	public function getDashboard() {
		$this->view->render('dashboard');
	}
}
