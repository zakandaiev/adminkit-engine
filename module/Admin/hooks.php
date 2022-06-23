<?php

############################# REGISTER #############################
$GLOBALS['admin_sidebar'] = [];

Hook::register('admin_sidebar_add', function($route) {
	$GLOBALS['admin_sidebar'][] = $route;
});

Hook::register('admin_sidebar_get', function() {
	return $GLOBALS['admin_sidebar'];
});

Hook::register('admin_sidebar_modify', function($sidebar) {
	if(!is_array($sidebar)) {
		return false;
	}

	$GLOBALS['admin_sidebar'] = $sidebar;

	return true;
});

############################# RUN #############################
Hook::run('admin_sidebar_add', [
	'icon' => 'home',
	'name' => __('Dashboard'),
	'route' => '/admin',
	'is_public' => true
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'user',
	'badge' => function() {
		$notifications_count = Auth::$user->notifications_count;
		return $notifications_count > 0 ? $notifications_count : null;
	},
	'name' => __('Profile'),
	'route' => '/admin/profile',
	'is_public' => true
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'log-out',
	'name' => __('Logout'),
	'route' => '/admin/logout',
	'is_public' => true
]);

Hook::run('admin_sidebar_add', [
	'name' => __('Content'),
	'is_divider' => true,
	'route' => '/admin/page'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'layout',
	'name' => __('Pages'),
	'route' => '/admin/page'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'message-square',
	'badge' => function() {
		$count = \Module\Admin\Model\Comment::getInstance()->countUnapprovedComments();
		return $count > 0 ? $count : null;
	},
	'name' => __('Comments'),
	'route' => '/admin/comment'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'menu',
	'name' => __('Menu'),
	'route' => '/admin/menu'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'globe',
	'name' => __('Translations'),
	'route' => '/admin/translation'
]);

Hook::run('admin_sidebar_add', [
	'name' => __('Administration'),
	'is_divider' => true,
	'route' => '/admin/user'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'users',
	'name' => __('Users'),
	'route' => [
		__('Users') => '/admin/user',
		__('Groups') => '/admin/group'
	]
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'settings',
	'name' => __('Settings'),
	'route' => [
		__('Main') => '/admin/setting/main',
		__('Site') => '/admin/setting/site',
		__('Contacts') => '/admin/setting/contact',
		__('Optimizations') => '/admin/setting/optimization'
	]
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'activity',
	'name' => __('Logs'),
	'route' => '/admin/log'
]);

Hook::run('admin_sidebar_add', [
	'icon' => 'box',
	'name' => __('Modules'),
	'route' => '/admin/module'
]);
