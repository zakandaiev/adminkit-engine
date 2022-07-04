<?php

require Path::file('form') . '/_Model/Group.php';

return [
	'table' => 'group',
	'fields' => [
		'name' => $name,
		'routes' => $routes,
		'users' => $users,
		'access_all' => $access_all,
		'is_enabled' => $is_enabled
	],
	'execute_post' => function($data) {
		Hook::run('group_' . $data->form_data['action'], $data);
	}
];
