<?php

$is_approved = [
	'boolean' => true,
	'modify' => function($field) {
		return !$field;
	}
];

return [
	'table' => 'comment',
	'fields' => [
		'is_approved' => $is_approved
	],
	'execute_post' => function($data) {
		Hook::run('comment_toggle', $data);
	}
];
