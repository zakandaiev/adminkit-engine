<?php

require __DIR__ . '/../User.php';

return [
	'table' => 'user',
	'language' => 'form_user',
	'field' => [
		'login' => $login,
		'email' => $email,
		'name' => $name,
		'avatar' => $avatar
	]
];