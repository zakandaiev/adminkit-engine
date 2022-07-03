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
		if(!password_verify($password_current, User::get($user_id)->password)) {
			Server::answer(null, 'error', __('Current password is incorrect'));
		}

		User::update('password', Hash::password($password_new), $user_id);
	},
	'execute_post' => function($data) {
		$user_data = new \stdClass();
		$user_data->id = $data->form_data['item_id'];

		$user_data->email = User::get($user_data->id)->email;

		$user_data->password_old = $data->fields['password_current'];
		$user_data->password_new = $data->fields['password_new'];

		Hook::run('user_change_password', $user_data);
	}
];
