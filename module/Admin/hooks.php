<?php

############################# NOTIFICATION #############################
$GLOBALS['admin_notification'] = [];

Hook::register('notification_add_type', function($notification) {
	if(!is_array($notification)) {
		return false;
	}

	$GLOBALS['admin_notification'][key($notification)] = $notification[key($notification)];
});
Hook::register('notification_modify_type', function($type, $notification) {
	if(!isset($GLOBALS['admin_notification'][$type]) || !is_array($notification)) {
		return false;
	}

	$GLOBALS['admin_notification'][$type] = $notification;
});

############################# SIDEBAR #############################
$GLOBALS['admin_sidebar'] = [];

Hook::register('sidebar_add', function($route) {
	$GLOBALS['admin_sidebar'][] = $route;
});
Hook::register('sidebar_modify', function($sidebar) {
	if(!is_array($sidebar)) {
		return false;
	}

	$GLOBALS['admin_sidebar'] = $sidebar;

	return true;
});

############################# TRANSLATION #############################
Hook::register('translation_edit', function($data) {
	Log::write('Translation: ' . $data['file_name'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'translation');
});

############################# GROUP #############################
Hook::register('group_add', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'group');
});
Hook::register('group_edit', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'group');
});
Hook::register('group_delete', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'group');
});

############################# USER #############################
Hook::register('user_add', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'user');
});
Hook::register('user_edit', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'user');
});
Hook::register('user_delete', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'user');
});

############################# COMMENT #############################
Hook::register('comment_add', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('comment_edit', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('comment_delete', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('comment_toggle', function($data) {
	$type = $data->fields['is_approved'] ? 'approved' : 'disapproved';

	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' ' . $type . ' by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'comment');
});

############################# MENU #############################
Hook::register('menu_add', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('menu_edit', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('menu_delete', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('menu_items_edit', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' changed items by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'menu');
});

############################# PAGE #############################
Hook::register('page_add', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'page');

	$page_origin = \Module\Admin\Model\Page::getInstance()->getPage($data->form_data['item_id']);

	$notification_type = $page_origin->is_category ? 'page_add_category' : 'page_add';

	$page_data = new \stdClass();

	$page_data->url = $page_origin->url;
	$page_data->author = $page_origin->author;

	$page_data->title = $data->fields['title'];
	$page_data->image = $data->fields['image'];
	$page_data->excerpt = $data->fields['excerpt'];

	Notification::create($notification_type, $page_data->author, $page_data);
});

Hook::register('page_edit', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'page');
});

Hook::register('page_delete', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'page');
});

############################# PROFILE #############################
Hook::register('user_change_login', function($data) {
	Mail::send('ChangeLogin', $data->email, $data);

	Notification::create('user_change_login', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed login from IP: ' . Request::$ip, 'user');
});
Hook::register('user_change_password', function($data) {
	Mail::send('ChangePassword', $data->email, $data);

	Notification::create('user_change_password', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed password from IP: ' . Request::$ip, 'user');
});
Hook::register('user_change_email', function($data) {
	Mail::send('ChangeEmail', $data->email, $data);

	Notification::create('user_change_email', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed email from IP: ' . Request::$ip, 'user');
});
Hook::register('user_change_name', function($data) {
	Notification::create('user_change_name', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed name from IP: ' . Request::$ip, 'user');
});
Hook::register('user_change_contacts', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' changed contact information from IP: ' . Request::$ip, 'user');
});

############################# RUN #############################
Hook::run('notification_add_type', [
	'user_register' => [
		'name' => __('Registration'),
		'icon' => 'user-plus',
		'color' => 'success',
		'user_can_manage' => false
	]
]);
Hook::run('notification_add_type', [
	'user_restore' => [
		'name' => __('Password restore'),
		'icon' => 'unlock',
		'color' => 'danger',
		'user_can_manage' => false
	]
]);
Hook::run('notification_add_type', [
	'user_authorize' => [
		'name' => __('Authorization'),
		'icon' => 'log-in',
		'color' => 'warning',
		'type' => 'web'
	]
]);
Hook::run('notification_add_type', [
	'user_change_name' => [
		'name' => __('Name change'),
		'icon' => 'edit',
		'color' => 'warning',
		'type' => 'web'
	]
]);
Hook::run('notification_add_type', [
	'user_change_email' => [
		'name' => __('Email change'),
		'icon' => 'mail',
		'color' => 'danger'
	]
]);
Hook::run('notification_add_type', [
	'user_change_login' => [
		'name' => __('Login change'),
		'icon' => 'at-sign',
		'color' => 'danger'
	]
]);
Hook::run('notification_add_type', [
	'user_change_password' => [
		'name' => __('Password change'),
		'icon' => 'lock',
		'color' => 'danger'
	]
]);
Hook::run('notification_add_type', [
	'page_add' => [
		'name' => __('Page creation'),
		'icon' => 'file-text',
		'color' => 'primary',
		'type' => 'web'
	]
]);
Hook::run('notification_add_type', [
	'page_add_category' => [
		'name' => __('Category creation'),
		'icon' => 'folder',
		'color' => 'primary',
		'type' => 'web'
	]
]);
Hook::run('notification_add_type', [
	'page_comment' => [
		'name' => __('Page comment'),
		'icon' => 'message-square',
		'color' => 'primary',
		'type' => 'web'
	]
]);
Hook::run('notification_add_type', [
	'comment_reply' => [
		'name' => __('Comment reply'),
		'icon' => 'corner-down-right',
		'color' => 'primary',
		'type' => 'web'
	]
]);

Hook::run('sidebar_add', [
	'icon' => 'home',
	'name' => __('Dashboard'),
	'route' => '/admin',
	'is_public' => true
]);
Hook::run('sidebar_add', [
	'icon' => 'user',
	'badge' => function() {
		$notifications_count = User::get()->notifications_count;
		return $notifications_count > 0 ? $notifications_count : null;
	},
	'name' => __('Profile'),
	'route' => '/admin/profile',
	'is_public' => true
]);
Hook::run('sidebar_add', [
	'icon' => 'log-out',
	'name' => __('Logout'),
	'route' => '/admin/logout',
	'is_public' => true
]);
Hook::run('sidebar_add', [
	'name' => __('Content'),
	'is_divider' => true,
	'route' => '/admin/page'
]);
Hook::run('sidebar_add', [
	'icon' => 'layout',
	'name' => __('Pages'),
	'route' => '/admin/page'
]);
Hook::run('sidebar_add', [
	'icon' => 'message-square',
	'badge' => function() {
		$count = \Module\Admin\Model\Comment::getInstance()->countUnapprovedComments();
		return $count > 0 ? $count : null;
	},
	'name' => __('Comments'),
	'route' => '/admin/comment'
]);
Hook::run('sidebar_add', [
	'icon' => 'menu',
	'name' => __('Menu'),
	'route' => '/admin/menu'
]);
Hook::run('sidebar_add', [
	'icon' => 'globe',
	'name' => __('Translations'),
	'route' => '/admin/translation'
]);
Hook::run('sidebar_add', [
	'name' => __('Administration'),
	'is_divider' => true,
	'route' => '/admin/user'
]);
Hook::run('sidebar_add', [
	'icon' => 'users',
	'name' => __('Users'),
	'route' => [
		__('Users') => '/admin/user',
		__('Groups') => '/admin/group'
	]
]);
Hook::run('sidebar_add', [
	'icon' => 'settings',
	'name' => __('Settings'),
	'route' => [
		__('Main') => '/admin/setting/main',
		__('Site') => '/admin/setting/site',
		__('Contacts') => '/admin/setting/contact',
		__('Optimizations') => '/admin/setting/optimization'
	]
]);
Hook::run('sidebar_add', [
	'icon' => 'activity',
	'name' => __('Logs'),
	'route' => '/admin/log'
]);
Hook::run('sidebar_add', [
	'icon' => 'box',
	'name' => __('Modules'),
	'route' => '/admin/module'
]);
