<?php

$all_checks = [
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

	'foreign' => function($field_value, $form_data) {
		debug($field_value);
		debug($form_data);
		exit;
	},

	'process' => function($pass) {
		return Hash::password($pass);
	},
];

$title = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200
];

return [
	'table' => 'page',
	'language' => 'form_page',
	'field' => [
		'title' => $title,
		'content' => [],
		'date_created' => [
			'date' => true
		],
		'enabled' => [
			'boolean' => true
		]
	]
];