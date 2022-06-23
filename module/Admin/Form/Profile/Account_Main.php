<?php

require Path::file('form') . '/_Model/User.php';

return [
	'submit' => __('Changes saved'),
	'table' => 'user',
	'fields' => [
		'login' => $login,
		'email' => $email,
		'name' => $name,
		'avatar' => $avatar
	],
	'execute_pre' => function($data) {
		$user_data = new \stdClass();
		$user_data->user_id = $data->form_data['item_id'];
		$user_data->ip = Request::$ip;

		$user_old = 'SELECT * FROM {user} WHERE id = :id ORDER BY date_created DESC LIMIT 1';

		$user_old = new Statement($user_old);

		$user_old = $user_old->execute(['id' => $user_data->user_id])->fetch();

		$login_old = $user_old->login;
		$email_old = $user_old->email;
		$name_old = $user_old->name;

		$login_new = $data->fields['login'];
		$email_new = $data->fields['email'];
		$name_new = $data->fields['name'];

		// CHECK LOGIN CHANGE
		if($data->fields['login'] !== $login_old) {
			$user_data->login_old = $login_old;
			$user_data->login_new = $login_new;

			$user_data->email = $email_new;
			Mail::send('ChangeLogin', $user_data);

			Notification::create('change_login', $user_data->user_id, $user_data);

			Log::write('User ID: ' . $user_data->user_id . ' changed login from IP: ' . $user_data->ip, 'user');
		}

		// CHECK EMAIL CHANGE
		if($data->fields['email'] !== $email_old) {
			$user_data->email_old = $email_old;
			$user_data->email_new = $email_new;

			$user_data->email = $email_old;
			Mail::send('ChangeEmail', $user_data);
			$user_data->email = $email_new;
			Mail::send('ChangeEmail', $user_data);

			Notification::create('change_email', $user_data->user_id, $user_data);

			Log::write('User ID: ' . $user_data->user_id . ' changed email from IP: ' . $user_data->ip, 'user');
		}

		// CHECK NAME CHANGE
		if($data->fields['name'] !== $name_old) {
			$user_data->name_old = $name_old;
			$user_data->name_new = $name_new;

			Notification::create('change_name', $user_data->user_id, $user_data);

			Log::write('User ID: ' . $user_data->user_id . ' changed name from IP: ' . $user_data->ip, 'user');
		}
	}
];
