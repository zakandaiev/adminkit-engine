<?php

require Path::file('form') . '/_Model/Comment.php';

return [
	'table' => 'comment',
	'fields' => [
		'author' => $author,
		'message' => $message,
		'date_created' => $date_created,
		'is_approved' => $is_approved
	]
];
