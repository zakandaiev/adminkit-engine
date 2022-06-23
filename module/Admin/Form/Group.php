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
		Log::write('Group ID: ' . $data->form_data['item_id'] . ' ' . $data->form_data['action'] . 'ed by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'group');
	}
];
