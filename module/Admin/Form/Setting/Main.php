<?php

$time_zone = [
	'required' => true
];
$language = [
	'required' => true
];

return [
	'table' => 'setting',
	'fields' => [
		'time_zone' => $time_zone,
		'language' => $language,
		'socials_allowed' => [],
		'enable_registration' => [
			'boolean' => true
		]
	]
];
