<?php

require Path::file('form') . '/_Model/User.php';

return [
	'table' => 'user',
	'fields' => [
		'group' => $group,
		'login' => $login,
		'password' => $password,
		'email' => $email,
		'phone' => $phone,
		'name' => $name,
		'socials' => $socials,
		'avatar' => $avatar,
		'address' => $address,
		'about' => $about,
		'birthday' => $birthday,
		'is_enabled' => [
			'boolean' => true
		]
	],
	'execute_post' => function($data) {
		Hook::run('user_' . $data->form_data['action'], $data);
	}
];
