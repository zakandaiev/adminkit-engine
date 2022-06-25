<?php

$all_checks = [
	// 'CHECKNAME_message' => 'Error message',
	'required_message' => __('This field is required'),

	'required' => true,
	'unset_null' => true,

	'html' => true,
	'json' => true,
	'int' => true,
	'float' => true,
	'email' => true,
	'ip' => true,
	'mac' => true,
	'url' => true,
	'date' => true,
	'date_not_future' => true,

	'min' => 1,
	'max' => 100,
	'minlength' => 1,
	'maxlength' => 100,
	'regexp' => '/^[0-9]+$/u',
	'regexp2' => '/^[a-z]+$/u',
	'regexp3' => '/^[A-Z]+$/u',

	'file' => true,
	'folder' => '',
	'extensions' => ['jpg','png'],

	// 'foreign' => 'table_name@primary_key_of_current_object/primary_key_of_foreign_object'
	'foreign' => 'user_group@user_id/group_id',

	'foreign' => function($field_value, $data) {
		debug($field_value);
		debug($data);
		exit;
	},

	'modify' => function($field) {
		// modify $field and return it
		return $field;
	},
];

$title = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200
];

return [
	'table' => 'page',
	'fields' => [
		'title' => $title,
		'content' => [],
		'date_created' => [
			'date' => true
		],
		'is_enabled' => [
			'boolean' => true
		]
	],
	'modify_fields' => function($data) {
		// modify $data object and return it
		return $data;
	},
	'modify_sql' => function($data) {
		// modify $data object and return it
		return $data;
	},
	'execute_pre' => function($data) {
		debug($data);
		exit;
	},
	'execute' => function($data) {
		debug($data);
		exit;
	},
	'execute_post' => function($data) {
		debug($data);
		exit;
	},
	'submit' => 'Saved',
];
