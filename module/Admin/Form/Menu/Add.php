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
	],
	'fields_modify' => function($fields, $form_data) {
		$fields['items'] = '[{"name":"","url":"","children":[]}]';

		return $fields;
	},
	'submit' => function($fields, $form_data) {
		return $form_data['item_id'];
	}
];
