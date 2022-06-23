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
	'execute_post' => function($data) {
		Log::write('Menu ID: ' . $data->form_data['item_id'] . ' ' . $data->form_data['action'] . 'ed by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
	},
	'submit' => function($fields, $form_data) {
		return $form_data['item_id'];
	}
];
