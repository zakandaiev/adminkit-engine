<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu',
	'fields' => [
		'name' => $name
	],
	'execute_post' => function($data) {
		Form::execute($data->form_data['action'], 'Menu/Translation', $data->form_data['item_id'], true);
	},
	'submit' => function($data) {
		if($data->form_data['action'] === 'add') {
			return $data->form_data['item_id'];
		}

		return null;
	}
];
