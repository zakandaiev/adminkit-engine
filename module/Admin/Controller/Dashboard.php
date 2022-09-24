<?php

namespace Module\Admin\Controller;

class Dashboard extends AdminController {
	public function getDashboard() {
		$this->page->title = __('Dashboard');
		$this->view->render('dashboard');
	}
}
