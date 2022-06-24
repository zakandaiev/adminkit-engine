<?php

############################# SIDEBAR #############################
$GLOBALS['admin_sidebar'] = [];

Hook::register('admin_sidebar_add', function($route) {
	$GLOBALS['admin_sidebar'][] = $route;
});

Hook::register('admin_sidebar_modify', function($sidebar) {
	if(!is_array($sidebar)) {
		return false;
	}

	$GLOBALS['admin_sidebar'] = $sidebar;

	return true;
});

############################# TRANSLATION #############################
Hook::register('admin_translation_edit', function($data) {
	Log::write('Translation: ' . $data['file_name'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'translation');
});

############################# GROUP #############################
Hook::register('admin_group_add', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'group');
});
Hook::register('admin_group_edit', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'group');
});
Hook::register('admin_group_delete', function($data) {
	Log::write('Group ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'group');
});

############################# USER #############################
Hook::register('admin_user_add', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_user_edit', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_user_delete', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'user');
});

############################# COMMENT #############################
Hook::register('admin_comment_add', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('admin_comment_edit', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('admin_comment_delete', function($data) {
	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
});
Hook::register('admin_comment_toggle', function($data) {
	$type = $data->fields['is_approved'] ? 'approved' : 'disapproved';

	Log::write('Comment ID: ' . $data->form_data['item_id'] . ' ' . $type . ' by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
});

############################# MENU #############################
Hook::register('admin_menu_add', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('admin_menu_edit', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('admin_menu_delete', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
});
Hook::register('admin_menu_items_edit', function($data) {
	Log::write('Menu ID: ' . $data->form_data['item_id'] . ' changed items by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
});

############################# PAGE #############################
Hook::register('admin_page_add', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' added by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'page');

	$page_origin = \Module\Admin\Model\Page::getInstance()->getPage($data->form_data['item_id']);

	$notification_kind = $page_origin->is_category ? 'category_add' : 'page_add';

	$page_data = new \stdClass();

	$page_data->url = $page_origin->url;
	$page_data->author = $page_origin->author;

	$page_data->title = $data->fields['title'];
	$page_data->image = $data->fields['image'];
	$page_data->excerpt = $data->fields['excerpt'];

	Notification::create($notification_kind, $page_data->author, $page_data);
});

Hook::register('admin_page_edit', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' edited by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'page');
});

Hook::register('admin_page_delete', function($data) {
	Sitemap::update();

	Log::write('Page ID: ' . $data->form_data['item_id'] . ' deleted by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'page');
});

############################# PROFILE #############################
Hook::register('admin_profile_change_login', function($data) {
	Mail::send('ChangeLogin', $data);

	Notification::create('change_login', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed login from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_profile_change_password', function($data) {
	Mail::send('ChangePassword', $data);

	Notification::create('change_password', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed password from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_profile_change_email', function($data) {
	Mail::send('ChangeEmail', $data);

	Notification::create('change_email', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed email from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_profile_change_name', function($data) {
	Notification::create('change_name', $data->id, $data);

	Log::write('User ID: ' . $data->id . ' changed name from IP: ' . Request::$ip, 'user');
});
Hook::register('admin_profile_change_contacts', function($data) {
	Log::write('User ID: ' . $data->form_data['item_id'] . ' changed contact information from IP: ' . Request::$ip, 'user');
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
