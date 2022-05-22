<?php

############################# ASSETS #############################
Asset::css('css/adminkit');
Asset::css('css/fancybox');
Asset::css('css/filepond');
Asset::css('css/quill');
Asset::css('css/slimselect');
Asset::css('css/main');

Asset::js('js/cyrToLat');
Asset::js('js/toast');

Asset::js('js/adminkit');
Asset::js('js/fancybox');
Asset::js('js/filepond');
Asset::js('js/quill');
Asset::js('js/slimselect');
Asset::js('js/sortable');
Asset::js('js/main');

############################# BREADCRUMBS #############################
Breadcrumb::setOption('render_homepage', true);
Breadcrumb::setOption('homepage_name', '<i class="align-middle" data-feather="home"></i>');
Breadcrumb::setOption('homepage_url', 'admin');
Breadcrumb::setOption('separator', '<i class="align-middle" data-feather="arrow-right"></i>');

############################# NOTIFICATIONS #############################
function getNotifications() {
	$notifications = [];

	$notifications['register'] = [
		'name' => __('Registration'),
		'icon' => 'user-plus',
		'color' => 'success'
	];
	$notifications['login'] = [
		'name' => __('Authorization'),
		'icon' => 'log-in',
		'color' => 'warning'
	];
	$notifications['restore'] = [
		'name' => __('Password restore'),
		'icon' => 'unlock',
		'color' => 'danger'
	];
	$notifications['change_login'] = [
		'name' => __('Login change'),
		'icon' => 'at-sign',
		'color' => 'danger'
	];
	$notifications['change_name'] = [
		'name' => __('Name change'),
		'icon' => 'edit',
		'color' => 'warning'
	];
	$notifications['change_password'] = [
		'name' => __('Password change'),
		'icon' => 'lock',
		'color' => 'danger'
	];
	$notifications['change_email'] = [
		'name' => __('Email change'),
		'icon' => 'mail',
		'color' => 'danger'
	];
	$notifications['page_add'] = [
		'name' => __('Page creation'),
		'icon' => 'file-text',
		'color' => 'primary'
	];
	$notifications['category_add'] = [
		'name' => __('Category creation'),
		'icon' => 'folder',
		'color' => 'primary'
	];
	$notifications['comment'] = [
		'name' => __('Comment'),
		'icon' => 'message-square',
		'color' => 'primary'
	];
	$notifications['comment_reply'] = [
		'name' => __('Comment reply'),
		'icon' => 'corner-down-right',
		'color' => 'primary'
	];

	return $notifications;
}

function notification($kind, $key = null) {
	$notifications = getNotifications();

	if(!isset($notifications[strval($kind)])) {
		return null;
	}

	if(isset($key)) {
		return $notifications[strval($kind)][strval($key)];
	}

	return $notifications[strval($kind)];
}

function notification_icon($kind) {
	$icon = notification($kind, 'icon');
	$color = notification($kind, 'color');

	return '<i class="text-' . $color . ' align-middle" data-feather="' . $icon . '"></i>';
}

function getNotificationHTML($notification, $user) {
	$icon = notification_icon($notification->kind);
	$when = date_when($notification->date_created);
	$user_name = (Auth::$user->id == $notification->user_id) ? __('You') : $user->name . ' (@' . $user->login . ')';
	$user_avatar = placeholder_avatar($user->avatar);
	$action_name = '';
	$action_body = '';
	$data = json_decode($notification->info);

	switch($notification->kind) {
		case 'register': {
			$from = '<a href="' . sprintf(DEFINE::SERVICE['ip_checker'], $data->ip) . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			$action_name = sprintf(__('created account from %s'), $from);
			break;
		}
		case 'login': {
			$from = '<a href="' . sprintf(DEFINE::SERVICE['ip_checker'], $data->ip) . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			$action_name = sprintf(__('authorized from %s'), $from);
			break;
		}
		case 'restore': {
			$action_name = 'restored password';
			break;
		}
		case 'change_login': {
			$from = '<strong>' . $data->login_old . '</strong>';
			$to = '<strong>' . $data->login_new . '</strong>';
			$action_name = sprintf(__('changed login from %s to %s'), $from, $to);
			break;
		}
		case 'change_name': {
			$from = '<strong>' . $data->name_old . '</strong>';
			$to = '<strong>' . $data->name_new . '</strong>';
			$action_name = sprintf(__('changed name from %s to %s'), $from, $to);
			break;
		}
		case 'change_password': {
			$action_name = __('changed password');
			break;
		}
		case 'change_email': {
			$from = '<strong>' . $data->email_old . '</strong>';
			$to = '<strong>' . $data->email_new . '</strong>';
			$action_name = sprintf(__('changed email from %s to %s'), $from, $to);
			break;
		}
		case 'page_add': {
			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('posted %s'), $page_title);

			$action_body = '<div class="mt-2"><img src="' . site('url') . '/' . placeholder_image($data->image) . '" class="w-25" alt="' . $data->title . '" data-fancybox></div>';

			if(!empty($data->excerpt)) {
				$action_body .= '<div class="text-sm text-muted mt-1">' . $data->excerpt . '</div>';
			}

			break;
		}
		case 'category_add': {
			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('posted %s'), $page_title);

			$action_body = '<div class="mt-2"><img src="' . site('url') . '/' . placeholder_image($data->image) . '" class="w-25" alt="' . $data->title . '" data-fancybox></div>';

			if(!empty($data->excerpt)) {
				$action_body .= '<div class="text-sm text-muted mt-1">' . $data->excerpt . '</div>';
			}

			break;
		}
		case 'comment': {
			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('leaved comment on %s'), $page_title);

			$action_body = '<div class="border text-sm text-muted p-2 mt-1">' . $data->comment . '</div>';
			break;
		}
		case 'comment_reply': {
			$user_name = $data->author;

			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('replied to your comment on %s'), $page_title);

			$action_body = '<div class="border text-sm text-muted p-2 mt-1">' . $data->reply . '</div>';
			break;
		}
		default: {
			$action_name = $notification->kind;
			break;
		}
	}

	$action_name = $icon . ' ' . $action_name;

	$output = '
		<div class="activity">
			<img src="/' . $user_avatar . '" width="36" height="36" class="rounded-circle me-2" alt="' . $user_name . '">
			<div class="flex-grow-1">
				<small class="float-end text-navy">' . $when . '</small>
				<strong>' . $user_name . '</strong>
				' . $action_name . $action_body . '
			</div>
		</div>
	';

	return $output;
}

############################# MENU #############################
function menu_builder($menu) {
	$output = '<ul class="list-group sortable">';

	foreach($menu as $item) {
		$output .= '<li class="list-group-item menu-list">';
		$output .= '<div class="menu-item">';
		$output .= '<i class="menu-item__icon sortable__handle feather-sm text-muted" data-feather="move"></i>';
		$output .= '<div class="menu-item__name"><span contenteditable="true">' . $item->name . '</span></div>';
		$output .= '<i class="menu-item__icon feather-sm text-muted" data-feather="link"></i>';
		$output .= '<div class="menu-item__url"><span contenteditable="true">' . $item->url . '</span></div>';
		$output .= '<i class="menu-item__icon feather-sm text-muted" data-feather="trash"></i>';
		$output .= '</div>';

		$output .= menu_builder($item->children);

		$output .= '</li>';
	}

	$output .= '</ul>';

	return $output;
}

############################# LOGS #############################
function logs($logs, $folder = null, $folder_hash = null) {
	$output = '';

	$folder_path = $folder;

	$folder_id = '';
	$folder_class = '';

	if(!empty($folder_hash)) {
		$folder_id = 'id="' . $folder_hash . '"';
		$folder_class = 'collapse';
	}

	$div_open = '<div ' . $folder_id . ' class="log ' . $folder_class . '">';
	$div_close = '</div>';

	foreach($logs as $log_key => $log_name) {
		$hash = 'folder-' . Hash::token(8);

		if(is_array($log_name)) {
			$output .= $div_open;
			$output .= '
				<i class="align-middle" data-feather="folder"></i>
				<a data-bs-toggle="collapse" href="#' . $hash . '" role="button" aria-expanded="false" aria-controls="' .$hash . '">
					<span class="align-middle">' . $log_key . '</span>
				</a>
			';
			$output .= logs($log_name, $folder . '@' .$log_key, $hash);
			$output .= $div_close;
		} else {
			$output .= $div_open;

			$log_url = site('url_language') . '/admin/log/' . (!empty($folder) ? trim($folder, '@') . '@' : '') . $log_name;

			$output .= '
				<i class="align-middle" data-feather="file-text"></i>
				<a href="' . $log_url . '" class="align-middle">' . $log_name . '</a>
			';

			$output .= $div_close;
		}
	}

	return $output;
}

function format_log($log_body) {
	$date = '<span class="log__date">$1</span>';
	$hyphen = '<span class="log__hyphen">$2</span>';
	$replacement = $date . ' ' . $hyphen;

	return preg_replace('/(\[.*\]) (-)/miu', $replacement, hc(trim($log_body)));
}

############################# HELPERS #############################
function icon_boolean($value = null) {
	$icon = 'x';

	if($value) {
		$icon = 'check';
	}

	return '<i class="align-middle" data-feather="' . $icon . '"></i>';
}

function table_actions($edit_url = null, $delete_attributes = [], $icons = []) {
	$edit = '';
	$delete = '';

	$edit_icon = $icons['edit'] ?? 'edit';
	$delete_icon = $icons['delete'] ?? 'trash';

	if(!empty($edit_url)) {
		$edit = '<a href="' . $edit_url .'"><i data-feather="' . $edit_icon . '"></i></a>';
	}

	if(!empty($delete_attributes)) {
		$delete = '<a';

		foreach($delete_attributes as $attribute => $value) {
			if(empty($attribute)) {
				continue;
			}

			$delete .= ' ' . $attribute . '="' . hc($value) . '"';
		}

		$delete .= ' href="#"><i data-feather="' . $delete_icon . '"></i></a>';
	}

	return $edit . ' ' . $delete;
}
