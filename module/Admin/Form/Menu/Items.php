<?php

$items = [
	'json' => true
];

return [
	'table' => 'menu',
	'fields' => [
		'items' => $items
	],
	'execute_post' => function($data) {
		Log::write('Menu ID: ' . $data->form_data['item_id'] . ' changed items by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
	}
];
