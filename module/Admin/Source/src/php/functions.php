<?php

############################# ASSETS #############################
Asset::css('css/adminkit');
Asset::css('css/fancybox');
Asset::css('css/filepond');
Asset::css('css/quill');
Asset::css('css/slimselect');
Asset::css('css/main');

Asset::js('js/cyr-to-lat', 'defer');
Asset::js('js/toast', 'defer');
Asset::js('js/adminkit', 'defer');
Asset::js('js/fancybox', 'defer');
Asset::js('js/filepond', 'defer');
Asset::js('js/imask', 'defer');
Asset::js('js/quill', 'defer');
Asset::js('js/slimselect', 'defer');
Asset::js('js/sortable', 'defer');
Asset::js('js/load-more', 'defer');
Asset::js('js/custom-fields', 'defer', ['/admin/page/edit/$id', '/admin/page/edit/$id/translation/edit/$language']);
Asset::js('js/menu', 'defer', ['/admin/menu', '/admin/menu/$id']);
Asset::js('js/translations', 'defer', '//admin/translation/$module/$language');
Asset::js('js/main', 'defer');

############################# BREADCRUMBS #############################
Breadcrumb::setOption('render_homepage', true);
Breadcrumb::setOption('homepage_name', '<i class="align-middle" data-feather="home"></i>');
Breadcrumb::setOption('homepage_url', 'admin');
Breadcrumb::setOption('separator', '<i class="align-middle" data-feather="arrow-right"></i>');

############################# NOTIFICATIONS #############################
function notification($type, $key = null) {
	$notifications = $GLOBALS['admin_notification'];

	if(isset($key) && isset($notifications[$type][$key])) {
		return $notifications[$type][$key];
	} else if(isset($key)) {
		return null;
	}

	if(!isset($notifications[$type])) {
		return [];
	}

	return $notifications[$type];
}

function notification_icon($type) {
	$icon = notification($type, 'icon');
	$color = notification($type, 'color');

	if(empty($icon) || empty($color)) {
		return null;
	}

	return '<i class="text-' . $color . ' align-middle" data-feather="' . $icon . '"></i>';
}

function getNotificationHTML($notification, $user) {
	$icon = notification_icon($notification->type);
	$when = date_when($notification->date_created);
	$user_name = (User::get()->id == $notification->user_id) ? __('You') : $user->nicename;
	$user_avatar = placeholder_avatar($user->avatar);
	$action_name = '';
	$action_body = '';
	$data = $notification->info;

	switch($notification->type) {
		case 'user_authorize': {
			$from = '<a href="' . sprintf(SERVICE['ip_checker'], $data->ip) . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			$action_name = sprintf(__('authorized from %s'), $from);
			break;
		}
		case 'user_register': {
			$from = '<a href="' . sprintf(SERVICE['ip_checker'], $data->ip) . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			$action_name = sprintf(__('created account from %s'), $from);
			break;
		}
		case 'user_restore': {
			$from = '<a href="' . sprintf(SERVICE['ip_checker'], $data->ip) . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			$action_name = sprintf(__('restored password from %s'), $from);
			break;
		}
		case 'user_change_login': {
			$from = '<strong>' . $data->login_old . '</strong>';
			$to = '<strong>' . $data->login_new . '</strong>';
			$action_name = sprintf(__('changed login from %s to %s'), $from, $to);
			break;
		}
		case 'user_change_name': {
			$from = '<strong>' . $data->name_old . '</strong>';
			$to = '<strong>' . $data->name_new . '</strong>';
			$action_name = sprintf(__('changed name from %s to %s'), $from, $to);
			break;
		}
		case 'user_change_password': {
			$action_name = __('changed password');
			break;
		}
		case 'user_change_email': {
			$from = '<strong>' . $data->email_old . '</strong>';
			$to = '<strong>' . $data->email_new . '</strong>';
			$action_name = sprintf(__('changed email from %s to %s'), $from, $to);
			break;
		}
		case 'page_add':
		case 'page_add_category': {
			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('posted %s'), $page_title);

			if($data->image) {
				$action_body = '<div class="mt-2"><img src="' . site('url') . '/' . placeholder_image($data->image) . '" class="w-25" alt="' . $data->title . '" data-fancybox></div>';
			}

			if(!empty($data->excerpt)) {
				$action_body .= '<div class="text-sm text-muted mt-1">' . $data->excerpt . '</div>';
			}

			break;
		}
		case 'comment_add': {
			$author = User::get($data->author);
			$user_name = (User::get()->id == $author->id) ? __('You') : $author->nicename;
			$user_avatar = placeholder_avatar($author->avatar);

			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('leaved comment on your %s'), $page_title);

			$action_body = '<div class="border text-sm text-muted p-2 mt-1">' . html($data->message) . '</div>';

			break;
		}
		case 'comment_reply': {
			$author = User::get($data->author);
			$user_name = (User::get()->id == $author->id) ? __('You') : $author->nicename;
			$user_avatar = placeholder_avatar($author->avatar);

			$reply_author = __('your');
			if($author->id == $data->parent_author) {
				if(User::get()->id == $data->parent_author) {
					$reply_author = __('your own');
				} else {
					$reply_author = __('his own');
				}
			} else if(User::get()->id !== $data->parent_author) {
				$reply_author = User::get($data->parent_author)->nicename;
			}

			$page_title = '<a href="' . site('url_language') . '/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';

			$action_name = sprintf(__('replied to <b>%s</b> comment on %s'), $reply_author, $page_title);

			$action_body = '<div class="border text-sm text-muted p-2 mt-1">' . html($data->message) . '</div>';

			break;
		}
		default: {
			$action_name = $notification->type;
			break;
		}
	}

	if(is_closure(notification($notification->type, 'html'))) {
		$action_name = @notification($notification->type, 'html')($data)->name;
		$action_body = @notification($notification->type, 'html')($data)->body;
	}

	$action_name = $icon . ' ' . $action_name;

	$output = '
		<div class="activity">
			<img src="' . site('url') . '/' . $user_avatar . '" width="36" height="36" class="rounded-circle me-2" alt="' . $user_name . '">
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
	$output = '<ul class="list-group sortable" data-multi="menu" data-handle=".sortable__handle" data-callback="editMenuItems">';

	foreach($menu as $item) {
		$output .= '<li class="list-group-item menu-list">';
		$output .= '<div class="menu-item">';
		$output .= '<i class="menu-item__icon sortable__handle feather-sm text-muted" data-feather="move"></i>';
		$output .= '<input class="menu-item__input" name="name" value="' . $item->name . '" placeholder="' . __('Name') . '">';
		$output .= '<i class="menu-item__icon feather-sm text-muted" data-feather="link"></i>';
		$output .= '<input class="menu-item__input" name="url" value="' . $item->url . '" placeholder="' . __('Link') . '">';
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

			$log_url = site('url_language') . '/admin/log/' . (!empty($folder) ? trim($folder ?? '', '@') . '@' : '') . $log_name;

			$output .= '
				<i class="align-middle" data-feather="file-text"></i>
				<a href="' . $log_url . '" class="align-middle">' . $log_name . '</a>
			';

			$output .= $div_close;
		}
	}

	return $output;
}

function format_log($body) {
	$date = '<span class="log__date">$1</span>';
	$hyphen = '<span class="log__hyphen">$2</span>';
	$replacement = $date . ' ' . $hyphen;

	return preg_replace('/(\[.*\]) (-)/miu', $replacement, trim($body ?? ''));
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

			$delete .= ' ' . $attribute . '="' . html($value) . '"';
		}

		$delete .= ' href="#"><i data-feather="' . $delete_icon . '"></i></a>';
	}

	return $edit . ' ' . $delete;
}

function locale_script($folder) {
	$base = Path::file('asset') . '/js/locale/' . $folder . '/';

	$url = '';

	$path = $base . site('language_current') . '.js';
	if(is_file($path)) {
		$url = str_replace(ROOT_DIR, Path::url(), $path);
	}

	$path = $base . sprintf('%s_%s', site('language_current'), lang(site('language_current'), 'region')) . '.js';
	if(is_file($path)) {
		$url = str_replace(ROOT_DIR, Path::url(), $path);
	}

	$path = $base . sprintf('%s-%s', site('language_current'), strtolower(lang(site('language_current'), 'region'))) . '.js';
	if(is_file($path)) {
		$url = str_replace(ROOT_DIR, Path::url(), $path);
	}

	$path = $base . sprintf('%s_%s', site('language_current'), strtolower(lang(site('language_current'), 'region'))) . '.js';
	if(is_file($path)) {
		$url = str_replace(ROOT_DIR, Path::url(), $path);
	}

	if(empty($url)) {
		return null;
	}

	return sprintf('<script src="%s"></script>', $url);
}
