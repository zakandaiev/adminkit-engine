<?php

$password_current = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200,
	'required_message' => __('Enter current password'),
	'minlength_message' => __('Current password is too short'),
	'maxlength_message' => __('Current password is too long')
];
$password_new = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200,
	'required_message' => __('Enter new password'),
	'minlength_message' => __('New password is too short'),
	'maxlength_message' => __('New password is too long')
];
$password_confirm = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200,
	'required_message' => __('Confirm your new password'),
	'minlength_message' => __('Confirmation password is too short'),
	'maxlength_message' => __('Confirmation password is too long')
];

return [
	'submit' => __('Password changed'),
	'table' => 'user',
	'fields' => [
		'password_current' => $password_current,
		'password_new' => $password_new,
		'password_confirm' => $password_confirm
	],
	'execute' => function($data) {
		$user_id = $data->fields['id'];
		$password_current = $data->fields['password_current'];
		$password_new = $data->fields['password_new'];
		$password_confirm = $data->fields['password_confirm'];

		if($password_current === $password_new) {
			Server::answer(null, 'error', __('New password must be different'));
		}
		if($password_new !== $password_confirm) {
			Server::answer(null, 'error', __('Confirmation password is incorrect'));
		}
		if(!password_verify($password_current, Auth::$user->password)) {
			Server::answer(null, 'error', __('Current password is incorrect'));
		}

		$sql = 'UPDATE {user} SET password = :password WHERE id = :id';
		$statement = new Statement($sql);
		$statement->execute(['password' => Hash::password($password_new), 'id' => $user_id]);
	},
	'execute_post' => function($data) {
		$user_data = new \stdClass();
		$user_data->user_id = $data->form_data['item_id'];
		$user_data->ip = Request::$ip;

		$user_email = 'SELECT email FROM {user} WHERE id = :id ORDER BY date_created DESC LIMIT 1';
		$user_email = new Statement($user_email);
		$user_data->email = $user_email->execute(['id' => $user_data->user_id])->fetchColumn();

		$user_data->password_old = $data->fields['password_current'];
		$user_data->password_new = $data->fields['password_new'];

		Mail::send('ChangePassword', $user_data);
		Notification::create('change_password', $user_data->user_id, $user_data);
		Log::write('User ID: ' . $user_data->user_id . ' changed password from IP: ' . $user_data->ip, 'user');
	}
];
