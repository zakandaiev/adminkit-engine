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
	'modify_fields' => function($data) {
		$data->fields['items'] = '[{"name":"","url":"","children":[]}]';
		return $data;
	},
	'submit' => function($fields, $form_data) {
		return $form_data['item_id'];
	}
];
