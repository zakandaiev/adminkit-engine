<?php

require __DIR__ . '/../User.php';

return [
	'submit' => 'Changes saved',
	'table' => 'user',
	'fields' => [
		'socials' => $socials,
		'phone' => $phone,
		'address' => $address,
		'about' => $about
	]
];
