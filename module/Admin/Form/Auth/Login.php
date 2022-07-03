<?php

$login = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200,
	'required_message' => __('Enter your login'),
	'minlength_message' => __('Login is too short'),
	'maxlength_message' => __('Login is too long')
];

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200,
	'required_message' => __('Enter your password'),
	'minlength_message' => __('Password is too short'),
	'maxlength_message' => __('Password is too long')
];

return [
	'table' => 'user',
	'fields' => [
		'login' => $login,
		'password' => $password
	],
	'execute' => function($data) {
		$statement = new Statement('SELECT * FROM {user} WHERE login = :login or email = :login');

		$user = $statement->execute($data->fields)->fetch();

		if(empty($user) || !password_verify($data->fields['password'], $user->password)) {
			Server::answer(null, 'error', __('Invalid login or password'));
		}

		if(!$user->is_enabled) {
			Server::answer(null, 'error', __('Your account has been disabled'));
		}

		User::authorize($user);
	}
];
