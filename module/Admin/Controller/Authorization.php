<?php

namespace Module\Admin\Controller;

use Engine\Auth;
use Engine\Database\Statement;
use Engine\Form;
use Engine\Server;

class Authorization extends \Engine\Controller {
	public function __construct() {
		parent::__construct();
	}

	public function checkAuth() {
		if($this->user->authorized) {
			Server::redirect('/admin');
		}
	}

	public function getForm() {
		$this->checkAuth();
		$this->view->render('login');
	}

	public function postAuth() {
		Form::check('Login');

		$sql_fields = Form::processFields('Login');

		$statement = new Statement('SELECT * FROM {user} WHERE login=:login or email=:login');

		$user = $statement->prepare()->bind($sql_fields)->execute()->fetch();

		if(empty($user) || !password_verify($sql_fields['password'], $user->password)) {
			Server::answer(null, 'error', 'Invalid login or password');
		}

		if(!$user->enabled) {
			Server::answer(null, 'error', 'Your account has been disabled');
		}

		Auth::authorize($user);

		Server::answer(null, 'success');
	}

	public function postUnAuth() {
		Auth::unauthorize();
		Server::redirect('/admin/login');

		return true;
	}

	public function getRestore() {
		$this->checkAuth();
		$this->view->render('reset-password');
	}

	public function postRestore() {
		echo "Authorization@postRestore";
	}

	public function getRegister() {
		$this->checkAuth();
		$this->view->render('register');
	}

	public function postRegister() {
		Form::check('Register');

		$sql_fields = Form::processFields('Register');

		if(empty($sql_fields)) {
			Server::answer(null, 'error', 'Form is invalid');
		}

		$sql_fields = json_decode(json_encode($sql_fields));
		
		Auth::register($sql_fields);

		Server::answer(null, 'success');
	}
}
