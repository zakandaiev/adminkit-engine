<?php

$login = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200
];

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200
];

return [
	'table' => 'user',
	'fields' => [
		'login' => $login,
		'password' => $password
	],
	'execute' => function($fields, $form_data) {
		$statement = new Statement('SELECT * FROM {user} WHERE login=:login or email=:login');

		$user = $statement->prepare()->bind($fields)->execute()->fetch();

		if(empty($user) || !password_verify($fields['password'], $user->password)) {
			Server::answer(null, 'error', __('Invalid login or password'));
		}

		if(!$user->is_enabled) {
			Server::answer(null, 'error', __('Your account has been disabled'));
		}

		Auth::authorize($user);
	}
];
