<?php

require Path::file('form') . '/_Model/User.php';

$name['required'] = true;
$name['required_message'] = __('Enter your name');

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
		'name' => $name,
		'login' => $login,
		'email' => $email,
		'password' => $password
	],
	'execute' => function($data) {
		User::register($data->fields);
	}
];
