<?php

$name = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_]+$/u'
];

return [
	'table' => 'menu',
	'fields' => [
		'name' => $name
	]
];
