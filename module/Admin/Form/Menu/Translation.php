<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu_translation',
	'fields' => [
		'language' => $language,
		'items' => $items
	],
	'modify_fields' => function($data) {
		if($data->form_data['action'] === 'add') {
			$data->fields['items'] = '[{"name":"","url":"","children":[]}]';
		}

		$data->fields['menu_id'] = $data->form_data['item_id'];
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
		Hook::run('menu_' . $data->form_data['action'], $data);
	}
];
