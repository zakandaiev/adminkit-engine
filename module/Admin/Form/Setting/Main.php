<?php

$time_zone = [
	'required' => true
];
$language = [
	'required' => true
];

return [
	'table' => 'setting',
	'language' => 'form_setting',
	'field' => [
		'time_zone' => $time_zone,
		'language' => $language,
		'languages_allowed' => [],
		'socials_allowed' => [],
		'enable_registration' => [
			'boolean' => true
		]
	]
];