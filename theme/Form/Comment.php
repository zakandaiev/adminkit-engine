<?php

$message = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 500,
	'required_message' => __('Message is required'),
	'minlength_message' => __('Message is too short'),
	'maxlength_message' => __('Message is too long')
];

$parent = [
	'int' => true
];

$page_id = [
	'int' => true
];

$author = [
	'int' => true
];

$ip = [
	'ip' => true
];

return [
	'table' => 'comment',
	'fields' => [
		'message' => $message,
		'parent' => $parent,
		'page_id' => $page_id,
		'author' => $author,
		'ip' => $ip
	],
	'modify_fields' => function($data) {
		$data->fields['ip'] = Request::$ip;
		$data->fields['author'] = User::get()->id;

		return $data;
	},
	'execute_post' => function($data) {
		Hook::run('comment_' . $data->form_data['action'], $data);
	}
];
