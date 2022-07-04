<?php

$is_enabled = [
	'boolean' => true,
	'modify' => function($field) {
		return !$field;
	}
];

return [
	'table' => 'page',
	'fields' => [
		'is_enabled' => $is_enabled
	],
	'execute_post' => function($data) {
		Hook::run('page_toggle', $data);
	}
];
