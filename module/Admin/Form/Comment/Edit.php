<?php

require Path::file('form') . '/_Model/Comment.php';

return [
	'table' => 'comment',
	'fields' => [
		'author' => $author,
		'message' => $message,
		'date_created' => $date_created,
		'is_approved' => $is_approved
	],
	'execute_post' => function($data) {
		Log::write('Comment ID: ' . $data->form_data['item_id'] . ' ' . $data->form_data['action'] . 'ed by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'comment');
	}
];
