<?php

$all_checks = [
	// 'TYPECHECK_message' => 'Error! This field is TYPECHECK',
	'required_message' => 'This field is required',

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
	'submit' => 'Saved',
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
	'fields_modify' => function($fields, $form_data) {
		// modify $fields and return it
		return $fields;
	},
	'execute_pre' => function($fields, $form_data) {
		debug($fields);
		debug($form_data);
		exit;
	},
	'execute' => function($fields, $form_data) {
		debug($fields);
		debug($form_data);
		exit;
	},
	'execute_post' => function($fields, $form_data) {
		debug($fields);
		debug($form_data);
		exit;
	}
];
