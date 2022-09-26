<?php

$email = [
	'required' => true,
	'email' => true,
	'minlength' => 6,
	'maxlength' => 200,
	'required_message' => __('Email is required'),
	'email_message' => __('Email format is invalid'),
	'minlength_message' => __('Email is too short'),
	'maxlength_message' => __('Email is too long')
];

$subject = [
	'minlength' => 2,
	'maxlength' => 64,
	'minlength_message' => __('Subject is too short'),
	'maxlength_message' => __('Subject is too long')
];

$message = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 500,
	'required_message' => __('Message is required'),
	'minlength_message' => __('Message is too short'),
	'maxlength_message' => __('Message is too long')
];

$ip = [
	'ip' => true
];

$user_id = [
	'int' => true
];

return [
	'table' => 'contact',
	'fields' => [
		'email' => $email,
		'subject' => $subject,
		'message' => $message,
		'ip' => $ip,
		'user_id' => $user_id
	],
	'modify_fields' => function($data) {
		$data->fields['ip'] = Request::$ip;

		if(User::get()->authorized) {
			$data->fields['user_id'] = User::get()->id;
		}

		return $data;
	},
	'execute_post' => function($data) {
		Hook::run('contact_' . $data->form_data['action'], $data);
	}
];
