<?php

$login = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200
];

$password = [
	'required' => true,
	'minlength' => 8,
	'maxlength' => 200
];

return [
	'table' => 'user',
	'field' => [
		'login' => $login,
		'password' => $password
	]
];
