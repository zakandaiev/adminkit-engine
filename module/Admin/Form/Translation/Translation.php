<?php

require Path::file('form') . '/_Model/Translation.php';

return [
	'table' => 'group',
	'fields' => [
		'key' => $key,
		'region' => $region,
		'name' => $name,
		'icon' => $icon
	],
	'execute_pre' => function($data) {
		debug($data);exit;
		rename('image1.jpg', 'module/Admin/image1.jpg');
	},
	'execute_post' => function($data) {
		Hook::run('translation_' . $data->form_data['action'], $data);
	}
];
