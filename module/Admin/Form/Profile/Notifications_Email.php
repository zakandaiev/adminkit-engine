<?php

$mail = [
	'required' => true,
	'boolean' => true
];

$fields = [];

foreach($GLOBALS['admin_notification'] as $key => $notification) {
	if(isset($notification['user_can_manage']) && $notification['user_can_manage'] == false) continue;
	if(isset($notification['type']) && !str_contains($notification['type'], 'mail')) continue;
	$fields['mail_' . $key] = $mail;
}

return [
	'submit' => __('Changes saved'),
	'table' => 'user',
	'fields' => $fields,
	'execute' => function($data) {
		$user = User::get($data->form_data['item_id']);

		foreach($GLOBALS['admin_notification'] as $key => $notification) {
			if(isset($notification['user_can_manage']) && $notification['user_can_manage'] == false) continue;
			if(isset($notification['type']) && !str_contains($notification['type'], 'mail')) continue;
			$user->setting->notifications->{'mail_' . $key} = $data->fields['mail_' . $key];
		}

		User::update('setting', $user->setting, $data->form_data['item_id']);
	},
	'execute_post' => function($data) {
		Hook::run('user_change_notifications', $data);
		Hook::run('user_change_notifications_mail', $data);
	}
];
