<?php

require Path::file('form') . '/_Model/User.php';

$password['required'] = true;
unset($password['unset_null']);
unset($password['modify']);

return [
	'table' => 'user',
	'fields' => [
		'password' => $password
	],
	'execute' => function($data) {
		$user = User::get($data->fields['id']);

		if(!$user || !password_verify($data->fields['password'], $user->password)) {
			Server::answer(null, 'error', __('Invalid password'));
		}

		User::delete($user->id);
	}
];
