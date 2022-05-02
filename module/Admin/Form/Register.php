<?php

require 'User.php';

$name['required'] = true;

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200
];

return [
	'table' => 'user',
	'field' => [
		'name' => $name,
		'login' => $login,
		'email' => $email,
		'password' => $password
	]
];
