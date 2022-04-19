<?php

namespace Module\Admin\Controller;

use Engine\Auth;
use Engine\Database\Statement;
use Engine\Form;
use Engine\Hash;
use Engine\Request;
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

		$this->authorize($user);

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

		$sql_fields['password'] = Hash::password(Request::$post['password']);

		$sql = '
			INSERT INTO {user}
				(name, login, email, password)
			VALUES 
				(:name, :login, :email, :password);
		';

		$statement = new Statement($sql);
		
		$sql_fields['id'] = $statement->prepare()->bind($sql_fields)->execute()->insertId();

		$this->authorize(json_decode(json_encode($sql_fields)));

		// Mail::send('registration completed');

		Server::answer(null, 'success');
	}

	private function authorize($user) {
		$user_ip = filter_var($_SERVER["REMOTE_ADDR"], FILTER_VALIDATE_IP);
		$auth_token = Hash::token($user->id.$user->login);

		$sql = '
			UPDATE {user} SET 
				auth_token=:auth_token,
				last_ip=:last_ip,
				last_auth=CURRENT_TIMESTAMP
			WHERE id=:id;
		';

		$statement = new Statement($sql);
		
		$statement->prepare()->bind(['id' => $user->id, 'last_ip' => $user_ip, 'auth_token' => $auth_token])->execute();

		Auth::authorize($user, $auth_token);

		return true;
	}
}