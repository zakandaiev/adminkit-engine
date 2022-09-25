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
		$sql = "SELECT count(*) FROM {menu_translation} WHERE menu_id = :id AND language = :language";

		$items_language_count = new Statement($sql);

		$items_language_count = $items_language_count->execute([
			'id' => $data->form_data['item_id'],
			'language' => $data->fields['language']
		])->fetchColumn();

		if($items_language_count === 0) {
			Form::execute('add', 'Menu/Items', $data->form_data['item_id'], true);
		}

		Hook::run('menu_items_edit', $data);
	}
];
