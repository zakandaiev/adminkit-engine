<?php

require __DIR__ . '/../User.php';

return [
	'submit' => 'Changes saved',
	'table' => 'user',
	'fields' => [
		'login' => $login,
		'email' => $email,
		'name' => $name,
		'avatar' => $avatar
	],
	'execute_pre' => function($fields, $form_data) {
		$data = new \stdClass();
		$data->user_id = $form_data['item_id'];

		$user_old = 'SELECT * FROM {user} WHERE id=:id ORDER BY date_created DESC LIMIT 1';

		$user_old = new Statement($user_old);

		$user_old = $user_old->bind(['id' => $data->user_id])->execute()->fetch();

		$login_old = $user_old->login;
		$email_old = $user_old->email;
		$name_old = $user_old->name;

		$login_new = $fields['login'];
		$email_new = $fields['email'];
		$name_new = $fields['name'];

		// CHECK LOGIN CHANGE
		if($fields['login'] !== $login_old) {
			$data->login_old = $login_old;
			$data->login_new = $login_new;

			Mail::send('ChangeLogin', $data);
			Notification::create('change_login', $data->user_id, $data);
		}

		// CHECK EMAIL CHANGE
		if($fields['email'] !== $email_old) {
			$data->email_old = $email_old;
			$data->email_new = $email_new;

			Mail::send('ChangeEmail', $data);
			Notification::create('change_email', $data->user_id, $data);
		}

		// CHECK NAME CHANGE
		if($fields['name'] !== $name_old) {
			$data->name_old = $name_old;
			$data->name_new = $name_new;

			Notification::create('change_name', $data->user_id, $data);
		}
	}
];
