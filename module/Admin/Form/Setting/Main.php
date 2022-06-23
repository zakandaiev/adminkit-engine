<?php

require Path::file('form') . '/_Model/Setting.php';

return [
	'table' => 'setting',
	'fields' => [
		'time_zone' => $time_zone,
		'language' => $language,
		'socials_allowed' => $socials_allowed,
		'enable_registration' => $enable_registration,
		'enable_password_restore' => $enable_password_restore,
		'moderate_comments' => $moderate_comments
	]
];
