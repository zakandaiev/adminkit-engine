<?php

namespace Module\Admin\Controller;

class Dashboard extends Controller {
	public function getDashboard() {
		$this->view->render('dashboard');
	}
}