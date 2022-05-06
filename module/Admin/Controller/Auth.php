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
		$this->page->title = __('Login');
		$this->view->render('auth/login');
	}

	public function getUnAuth() {
		\Engine\Auth::unauthorize();
		\Engine\Server::redirect('/admin/login');
	}

	public function getRestore() {
		$this->checkAuth();
		$this->page->title = __('Reset password');
		$this->view->render('auth/reset-password');
	}

	public function getRegister() {
		$this->checkAuth();
		$this->page->title = __('Register');
		$this->view->render('auth/register');
	}
}
