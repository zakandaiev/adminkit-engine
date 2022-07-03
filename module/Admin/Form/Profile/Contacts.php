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
		Hook::run('user_change_contacts', $data);
	}
];
