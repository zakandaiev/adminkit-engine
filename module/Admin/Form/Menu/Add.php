<?php

require Path::file('form') . '/_Model/Menu.php';

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
