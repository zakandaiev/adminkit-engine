<?php

require Path::file('form') . '/_Model/Setting.php';

return [
	'table' => 'setting',
	'fields' => [
		'address' => $address,
		'coordinate_x' => $coordinate_x,
		'coordinate_y' => $coordinate_y,
		'hours' => $hours,
		'email' => $email,
		'phones' => $phones
	]
];
