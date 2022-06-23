<?php

$is_approved = [
	'boolean' => true,
	'modify' => function($field) {
		return !$field;
	}
];

return [
	'table' => 'comment',
	'fields' => [
		'is_approved' => $is_approved
	],
	'execute_post' => function($data) {
		$type = $data->fields['is_approved'] ? 'approved' : 'disapproved';
		Log::write('Comment ID: ' . $data->form_data['item_id'] . ' ' . $type . ' by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
	}
];
