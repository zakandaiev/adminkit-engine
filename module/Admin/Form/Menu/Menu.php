<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu',
	'fields' => [
		'name' => $name
	],
	'modify_fields' => function($data) {
		if($data->form_data['action'] === 'add') {
			$data->fields['items'] = '[{"name":"","url":"","children":[]}]';
		}

		return $data;
	},
	'execute_post' => function($data) {
		Hook::run('menu_' . $data->form_data['action'], $data);
	},
	'submit' => function($data) {
		if($data->form_data['action'] === 'add') {
			return $data->form_data['item_id'];
		}

		return null;
	}
];
