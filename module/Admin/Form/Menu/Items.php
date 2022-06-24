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
		Hook::run('admin_menu_items_edit', $data);
	}
];
