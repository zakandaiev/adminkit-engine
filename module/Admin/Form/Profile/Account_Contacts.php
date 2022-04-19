<?php

require __DIR__ . '/../User.php';

return [
	'table' => 'user',
	'language' => 'form_user',
	'field' => [
		'socials' => $socials,
		'phone' => $phone,
		'address' => $address,
		'about' => $about
	]
];