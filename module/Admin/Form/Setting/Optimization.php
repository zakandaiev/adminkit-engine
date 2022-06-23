<?php

require Path::file('form') . '/_Model/Setting.php';

return [
	'table' => 'setting',
	'fields' => [
		'group_css' => $group_css,
		'group_js' => $group_js,
		'cache_db' => $cache_db
	]
];
