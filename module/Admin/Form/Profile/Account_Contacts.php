<?php

require __DIR__ . '/../User.php';

return [
	'table' => 'user',
	'fields' => [
		'socials' => $socials,
		'phone' => $phone,
		'address' => $address,
		'about' => $about
	]
];
