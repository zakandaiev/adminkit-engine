<?php

$is_enabled = [
	'boolean' => true,
	'modify' => function($field) {
		return !$field;
	}
];

return [
	'table' => 'group',
	'fields' => [
		'is_enabled' => $is_enabled
	],
	'execute_post' => function($data) {
		Hook::run('group_toggle', $data);
	}
];
