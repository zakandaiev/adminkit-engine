<?php

namespace Module\Admin\Controller;

use Engine\Server;
use Engine\User;

class Auth extends \Engine\Controller {
	public function __construct() {
		parent::__construct();
	}

	public function checkAuth() {
		if($this->user->authorized) {
			Server::redirect('/admin');
		}
	}

	public function getLogin() {
		$this->checkAuth();
		$this->view->render('auth/login');
	}

	public function getUnAuth() {
		User::unauthorize();
		Server::redirect('/admin/login');
	}

	public function getRestore() {
		$this->checkAuth();

		if(!site('enable_password_restore')) {
			$this->view->error('404');
		}

		$this->view->render('auth/reset-password');
	}

	public function getRegister() {
		$this->checkAuth();

		if(!site('enable_registration')) {
			$this->view->error('404');
		}

		$this->view->render('auth/register');
	}
}
