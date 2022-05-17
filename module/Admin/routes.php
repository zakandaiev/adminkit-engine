<?php

############################# UPLOAD #############################
// Module::route('get', '/upload', 'Upload@get');
Module::route('post', '/upload', 'Upload@post');
Module::route('delete', '/upload', 'Upload@delete');

############################# AUTH #############################
Module::route('get', '/admin/login', 'Auth@getLogin', [
	'page' => [
		'title' => __('Login')
	],
	'is_public' => true
]);

Module::route('get', '/admin/logout', 'Auth@getUnAuth', [
	'page' => [
		'title' => __('Logout')
	],
	'is_public' => true
]);

Module::route('get', '/admin/reset-password', 'Auth@getRestore', [
	'page' => [
		'title' => __('Reset password')
	],
	'is_public' => true
]);

Module::route('get', '/admin/register', 'Auth@getRegister', [
	'page' => [
		'title' => __('Register')
	],
	'is_public' => true
]);

############################# DASHBOARD #############################
Module::route('get', '/admin', 'Dashboard@getDashboard', [
	'page' => [
		'title' => __('Dashboard')
	],
	'is_public' => true
]);

Module::route('get', '/admin/dashboard', 'Dashboard@getDashboard', [
	'page' => [
		'title' => __('Dashboard')
	],
	'is_public' => true
]);

############################# PROFILE #############################
Module::route('get', '/admin/profile', 'Profile@getProfile', [
	'page' => [
		'title' => __('Profile')
	],
	'is_public' => true
]);

Module::route('get', '/admin/profile/edit', 'Profile@getEdit', [
	'page' => [
		'title' => __('Edit profile')
	],
	'is_public' => true
]);

Module::route('get', '/admin/profile/$id', 'Profile@getProfile', [
	'page' => [
		'title' => __('Profile')
	]
]);

############################# SETTING #############################
Module::route('get', '/admin/setting/$section', 'Setting@getSection');
Module::route('post', '/admin/setting/$section', 'Setting@postSection');

############################# PAGE #############################
Module::route('get', '/admin/page', 'Page@getAll', [
	'page' => [
		'title' => __('Pages')
	],
	'breadcrumbs' => [
		['name' => __('Pages')]
	]
]);

Module::route('get', '/admin/page/category/$id', 'Page@getCategory');

Module::route('get', '/admin/page/add', 'Page@getAdd', [
	'page' => [
		'title' => __('Pages')
	],
	'breadcrumbs' => [
		['name' => __('Pages'), 'url' => '/admin/page'],
		['name' => (Request::has('is_category')) ? __('Add category') : __('Add page')],
	]
]);

Module::route('get', '/admin/page/edit/$id', 'Page@getEdit', [
	'page' => [
		'title' => __('Edit page')
	],
	'breadcrumbs' => [
		['name' => __('Pages'), 'url' => '/admin/page'],
		['name' => __('Edit page')],
	]
]);
Module::route('get', '/admin/page/edit/$id/translation/add/$language', 'Page@getAddTranslation');
Module::route('get', '/admin/page/edit/$id/translation/edit/$translation_id', 'Page@getEdit');

############################# COMMENT #############################
Module::route('get', '/admin/comment', 'Comment@getAll', [
	'page' => [
		'title' => __('Comments')
	],
	'breadcrumbs' => [
		['name' => __('Comments')]
	]
]);

Module::route('get', '/admin/comment/edit/$id', 'Comment@getEdit');

############################# USER #############################
Module::route('get', '/admin/user', 'User@getAll');
Module::route('get', '/admin/user/add', 'User@getAdd');
Module::route('get', '/admin/user/edit/$id', 'User@getEdit');

############################# GROUP #############################
Module::route('get', '/admin/group', 'Group@getAll');
Module::route('get', '/admin/group/add', 'Group@getAdd');
Module::route('get', '/admin/group/edit/$id', 'Group@getEdit');
