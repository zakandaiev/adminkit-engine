<?php

require Path::file('form') . '/_Model/User.php';

return [
	'submit' => __('Changes saved'),
	'table' => 'user',
	'fields' => [
		'socials' => $socials,
		'phone' => $phone,
		'address' => $address,
		'about' => $about,
		'birthday' => $birthday
	],
	'execute_post' => function($data) {
		Log::write('User ID: ' . Auth::$user->id . ' changed contact information from IP: ' . Request::$ip, 'user');
	}
];
