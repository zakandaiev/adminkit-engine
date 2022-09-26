<?php

$is_read = [
	'boolean' => true,
	'modify' => function($field) {
		return !$field;
	}
];

return [
	'table' => 'contact',
	'fields' => [
		'is_read' => $is_read
	],
	'execute_post' => function($data) {
		Hook::run('contact_toggle', $data);
	}
];
