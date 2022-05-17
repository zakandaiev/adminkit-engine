<?php

namespace Module\Admin\Controller;

class Auth extends \Engine\Controller {
	public function __construct() {
		parent::__construct();
	}

	public function checkAuth() {
		if($this->user->authorized) {
			\Engine\Server::redirect('/admin');
		}
	}

	public function getLogin() {
		$this->checkAuth();
		$this->view->render('auth/login');
	}

	public function getUnAuth() {
		\Engine\Auth::unauthorize();
		\Engine\Server::redirect('/admin/login');
	}

	public function getRestore() {
		$this->checkAuth();
		$this->view->render('auth/reset-password');
	}

	public function getRegister() {
		$this->checkAuth();
		$this->view->render('auth/register');
	}
}
