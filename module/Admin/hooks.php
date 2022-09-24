<?php

############################# ADMIN SIDEBAR #############################
$GLOBALS['admin_sidebar'] = [];

Hook::register('admin_sidebar_append', function($route) {
	$GLOBALS['admin_sidebar'][] = $route;
});
Hook::register('admin_sidebar_prepend', function($route) {
	array_unshift($GLOBALS['admin_sidebar'] , $route);
});
Hook::register('admin_sidebar_append_after', function($position, $append_route) {
	$sidebar = [];

	foreach($GLOBALS['admin_sidebar'] as $route) {
		$sidebar[] = $route;

		if(is_string($route['route']) && trim($route['route'], '/') === trim($position, '/')) {
			$sidebar[] = $append_route;
		}
	}

	$GLOBALS['admin_sidebar'] = $sidebar;
});
Hook::register('admin_sidebar_change', function($sidebar) {
	if(!is_array($sidebar)) {
		return false;
	}

	$GLOBALS['admin_sidebar'] = $sidebar;

	return true;
});

############################# NOTIFICATION #############################
$GLOBALS['admin_notification'] = [];

Hook::register('notification_add', function($type, $data) {
	if(empty($type) || empty($data)) {
		return false;
	}

	$GLOBALS['admin_notification'][$type] = $data;
});
Hook::register('notification_modify', function($type, $data) {
	if(!isset($GLOBALS['admin_notification'][$type]) || empty($data)) {
		return false;
	}

	$GLOBALS['admin_notification'][$type] = $data;
});

############################# TRANSLATION #############################
Hook::register('translation_add', function($data) {
	Log::write('Translation: ' . $data['file'] . ' added for ' . $data['module'] . ' module by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'translation');
});
Hook::register('translation_edit', function($data) {
	Log::write('Translation: ' . $data['file'] . ' edited for ' . $data['module'] . ' module by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'translation');
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
Hook::run('notification_add', 'user_register', [
		'name' => __('Registration'),
		'icon' => 'user-plus',
		'color' => 'success',
		'user_can_manage' => false
	]
);
Hook::run('notification_add', 'user_restore', [
		'name' => __('Password restore'),
		'icon' => 'unlock',
		'color' => 'danger',
		'user_can_manage' => false
	]
);
Hook::run('notification_add', 'user_authorize', [
		'name' => __('Authorization'),
		'icon' => 'log-in',
		'color' => 'warning',
		'type' => 'web'
	]
);
Hook::run('notification_add', 'user_change_name', [
		'name' => __('Name change'),
		'icon' => 'edit',
		'color' => 'warning',
		'type' => 'web'
	]
);
Hook::run('notification_add', 'user_change_email', [
		'name' => __('Email change'),
		'icon' => 'mail',
		'color' => 'danger'
	]
);
Hook::run('notification_add', 'user_change_login', [
		'name' => __('Login change'),
		'icon' => 'at-sign',
		'color' => 'danger'
	]
);
Hook::run('notification_add', 'user_change_password', [
		'name' => __('Password change'),
		'icon' => 'lock',
		'color' => 'danger'
	]
);
Hook::run('notification_add', 'page_add', [
		'name' => __('Page creation'),
		'icon' => 'file-text',
		'color' => 'primary',
		'type' => 'web'
	]
);
Hook::run('notification_add', 'page_add_category', [
		'name' => __('Category creation'),
		'icon' => 'folder',
		'color' => 'primary',
		'type' => 'web'
	]
);
Hook::run('notification_add', 'page_comment', [
		'name' => __('Page comment'),
		'icon' => 'message-square',
		'color' => 'primary',
		'type' => 'web'
	]
);
Hook::run('notification_add', 'comment_reply', [
		'name' => __('Comment reply'),
		'icon' => 'corner-down-right',
		'color' => 'primary',
		'type' => 'web'
	]
);

Hook::run('admin_sidebar_append', [
	'icon' => 'home',
	'name' => __('Dashboard'),
	'route' => '/admin',
	'is_public' => true
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'user',
	'badge' => function() {
		$notifications_count = User::get()->notifications_count;
		return $notifications_count > 0 ? $notifications_count : null;
	},
	'name' => __('Profile'),
	'route' => '/admin/profile',
	'is_public' => true
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'log-out',
	'name' => __('Logout'),
	'route' => '/admin/logout',
	'is_public' => true
]);
Hook::run('admin_sidebar_append', [
	'name' => __('Content'),
	'is_divider' => true,
	'route' => '/admin/page'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'layout',
	'name' => __('Pages'),
	'route' => '/admin/page'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'message-square',
	'badge' => function() {
		$count = \Module\Admin\Model\Comment::getInstance()->countUnapprovedComments();
		return $count > 0 ? $count : null;
	},
	'name' => __('Comments'),
	'route' => '/admin/comment'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'menu',
	'name' => __('Menu'),
	'route' => '/admin/menu'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'globe',
	'name' => __('Translations'),
	'route' => '/admin/translation'
]);
Hook::run('admin_sidebar_append', [
	'name' => __('Administration'),
	'is_divider' => true,
	'route' => '/admin/user'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'users',
	'name' => __('Users'),
	'route' => [
		__('Users') => '/admin/user',
		__('Groups') => '/admin/group'
	]
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'settings',
	'name' => __('Settings'),
	'route' => [
		__('Main') => '/admin/setting/main',
		__('Site') => '/admin/setting/site',
		__('Contacts') => '/admin/setting/contact',
		__('Optimizations') => '/admin/setting/optimization'
	]
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'activity',
	'name' => __('Logs'),
	'route' => '/admin/log'
]);
Hook::run('admin_sidebar_append', [
	'icon' => 'box',
	'name' => __('Modules'),
	'route' => '/admin/module'
]);
