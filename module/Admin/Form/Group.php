<?php

$name = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200,
	'regexp' => '/^[\w]+$/u'
];
$routes = [
	'foreign' => 'group_route@group_id/route'
];
$users = [
	'foreign' => 'user_group@group_id/user_id'
];
$bool = [
	'boolean' => true
];

return [
	'table' => 'group',
	'fields' => [
		'name' => $name,
		'routes' => $routes,
		'users' => $users,
		'access_all' => $bool,
		'is_enabled' => $bool
	]
];
