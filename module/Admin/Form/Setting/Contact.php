<?php

$address = [
	'required' => false,
	'maxlength' => 200
];
$coordinates = [
	'required' => false,
	'float' => true
];
$hours = [
	'required' => false,
	'maxlength' => 200
];
$email = [
	'email' => true
];

return [
	'table' => 'setting',
	'fields' => [
		'address' => $address,
		'coordinate_x' => $coordinates,
		'coordinate_y' => $coordinates,
		'hours' => $hours,
		'email' => $email
	]
];
