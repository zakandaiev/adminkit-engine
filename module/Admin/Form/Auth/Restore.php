<?php

require Path::file('form') . '/_Model/User.php';

$email['required_message'] = __('Enter your email');

return [
	'table' => 'user',
	'fields' => [
		'email' => $email
	],
	'execute' => function($data) {
		Auth::restore($data->fields['email']);
	}
];
