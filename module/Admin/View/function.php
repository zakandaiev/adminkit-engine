<?php

Asset::css('css/adminkit');
Asset::css('css/fancybox');
Asset::css('css/filepond');
Asset::css('css/quill');
Asset::css('css/slimselect');
Asset::css('css/main');

Asset::js('js/adminkit');
Asset::js('js/fancybox');
Asset::js('js/cyr_to_lat');
Asset::js('js/filepond');
Asset::js('js/quill');
Asset::js('js/slimselect');
Asset::js('js/sortable');
Asset::js('js/main');

############################# NOTIFICATION #############################
function getNotificationIcon($notification_kind) {
	$color = 'primary';
	$icon = 'alert-circle';

	switch($notification_kind) {
		case 'register': {
			$icon = 'user-plus';
			$color = 'success';
			break;
		}
		case 'authorize': {
			$icon = 'log-in';
			$color = 'warning';
			break;
		}
		case 'restore': {
			$icon = 'unlock';
			$color = 'danger';
			break;
		}
		case 'change_login': {
			$icon = 'at-sign';
			$color = 'danger';
			break;
		}
		case 'change_name': {
			$icon = 'edit';
			$color = 'warning';
			break;
		}
		case 'change_password': {
			$icon = 'lock';
			$color = 'danger';
			break;
		}
		case 'change_email': {
			$icon = 'at-sign';
			$color = 'danger';
			break;
		}
		case 'page': {
			$icon = 'file-text';
			break;
		}
		case 'comment': {
			$icon = 'message-square';
			break;
		}
		case 'comment_reply': {
			$icon = 'corner-down-right';
			break;
		}
	}

	return '<i class="text-' . $color . ' align-middle" data-feather="' . $icon . '"></i>';
}

function getNotificationHTML($notification, $user) {
	$icon = getNotificationIcon($notification->kind);
	$when = date_when($notification->date_created);
	$user_name = 'You';
	$user_avatar = placeholder_avatar($user->avatar);
	$action_name = '';
	$action_body = '';
	$data = json_decode($notification->info);

	switch($notification->kind) {
		case 'register': {
			$action_name = 'created account';
			$action_name .= ' from <a href="https://check-host.net/ip-info?host=' . $data->ip . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			break;
		}
		case 'authorize': {
			$action_name = 'logged in from';
			$action_name .= ' <a href="https://check-host.net/ip-info?host=' . $data->ip . '" target="_blank"><strong>' . $data->ip . '</strong></a>';
			break;
		}
		case 'restore': {
			$action_name = 'restored your password';
			break;
		}
		case 'change_login': {
			$action_name = 'changed your login';
			$action_name .= ' from <strong>' . $data->login_old . '</strong>';
			$action_name .= ' to <strong>' . $data->login_new . '</strong>';
			break;
		}
		case 'change_name': {
			$action_name = 'changed your name';
			$action_name .= ' from <strong>' . $data->name_old . '</strong>';
			$action_name .= ' to <strong>' . $data->name_new . '</strong>';
			break;
		}
		case 'change_password': {
			$action_name = 'changed your password';
			break;
		}
		case 'change_email': {
			$action_name = 'changed your email';
			$action_name .= ' from <strong>' . $data->email_old . '</strong>';
			$action_name .= ' to <strong>' . $data->email_new . '</strong>';
			break;
		}
		case 'page': {
			$action_name = 'created';
			$action_name .= ' <a href="/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';
			if(is_file(ROOT_DIR . '/' . $data->image)) {
				$preview = '
					<div class="col-6 col-md-4 col-lg-4 col-xl-3">
						<img src="/' . $data->image . '" class="img-fluid pe-2" alt="' . $data->title . '" data-fancybox>
					</div>
				';
				$action_body = '<div class="row g-0 mt-1">' . $preview . '</div>';
			}
			break;
		}
		case 'comment': {
			$action_name = 'leaved comment on';
			$action_name .= ' <a href="/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';
			$action_body = '<div class="border text-sm text-muted p-2 mt-1">' . $data->comment . '</div>';
			break;
		}
		case 'comment-reply': {
			$action_name = 'replied to your comment on';
			$action_name .= ' <a href="/' . $data->url . '" target="_blank"><strong>' . $data->title . '</strong></a>';
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
