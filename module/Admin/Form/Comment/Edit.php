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
		Hook::run('comment_' . $data->form_data['action'], $data);
	}
];
