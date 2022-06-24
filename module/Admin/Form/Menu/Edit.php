<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu',
	'fields' => [
		'name' => $name
	],
	'execute_post' => function($data) {
		Hook::run('admin_menu_' . $data->form_data['action'], $data);
	}
];
