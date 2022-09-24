<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu_translation',
	'fields' => [
		'items' => $items
	],
	'modify_fields' => function($data) {
		if($data->form_data['action'] === 'add') {
			$data->fields['menu_id'] = $data->form_data['item_id'];
		}

		$data->fields['language'] = site('language_current');

		return $data;
	},
	'modify_sql' => function($data) {
		if($data->form_data['action'] !== 'add') {
			$data->sql .= ' AND language = :language';
		}

		return $data;
	},
	'execute_post' => function($data) {
		if($data->count === 0) {
			Form::execute('add', 'Menu/Items', $data->form_data['item_id'], true);
		}

		Hook::run('menu_items_edit', $data);
	}
];
