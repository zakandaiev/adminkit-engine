<?php

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200
];

return [
	'table' => 'user',
	'language' => 'form_password',
	'field' => [
		'password_current' => $password,
		'password_new' => $password,
		'password_confirm' => $password
	],
	'execute' => function($fields) {
		$user_id = $fields['id'];
		$password_current = $fields['password_current'];
		$password_new = $fields['password_new'];
		$password_confirm = $fields['password_confirm'];

		if($password_current === $password_new) {
			Server::answer(null, 'error', __('form_password', 'new_must_be_different'));
		}
		if($password_new !== $password_confirm) {
			Server::answer(null, 'error', __('form_password', 'confirm_is_incorrect'));
		}
		if(!password_verify($password_current, Auth::$user->password)) {
			Server::answer(null, 'error', __('form_password', 'current_is_incorrect'));
		}

		$sql = 'UPDATE {user} SET password=:password WHERE id=:id';
		$statement = new Statement($sql);
		$statement->prepare()->bind(['password' => Hash::password($password_new), 'id' => $user_id])->execute();
	}
];
