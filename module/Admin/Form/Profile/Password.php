<?php

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200
];

return [
	'submit' => 'Password changed',
	'table' => 'user',
	'fields' => [
		'password_current' => $password,
		'password_new' => $password,
		'password_confirm' => $password
	],
	'execute' => function($fields, $form_data) {
		$user_id = $fields['id'];
		$password_current = $fields['password_current'];
		$password_new = $fields['password_new'];
		$password_confirm = $fields['password_confirm'];

		if($password_current === $password_new) {
			Server::answer(null, 'error', __('New password must be different'));
		}
		if($password_new !== $password_confirm) {
			Server::answer(null, 'error', __('Confirmation password is incorrect'));
		}
		if(!password_verify($password_current, Auth::$user->password)) {
			Server::answer(null, 'error', __('Current password is incorrect'));
		}

		$sql = 'UPDATE {user} SET password=:password WHERE id=:id';
		$statement = new Statement($sql);
		$statement->bind(['password' => Hash::password($password_new), 'id' => $user_id])->execute();
	},
	'execute_post' => function($fields, $form_data) {
		$data = new \stdClass();
		$data->user_id = $form_data['item_id'];

		$user_email = 'SELECT email FROM {user} WHERE id=:id ORDER BY date_created DESC LIMIT 1';
		$user_email = new Statement($user_email);
		$data->user_email = $user_email->bind(['id' => $data->user_id])->execute()->fetchColumn();

		$data->password_old = $fields['password_current'];
		$data->password_new = $fields['password_new'];

		Mail::send('ChangePassword', $data);
		Notification::create('change_password', $data->user_id, $data);
	}
];
