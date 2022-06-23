<?php

$group = [
	'foreign' => 'user_group@user_id/group_id'
];
$login = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_]+$/',
	'regexp2' => '/(?i)^(?![a4]dm[i1_][n]*|m[o0]d[e3]r[a4]t[o0][r]*)+/i',
	'required_message' => __('Login is required'),
	'minlength_message' => __('Login is too short'),
	'maxlength_message' => __('Login is too long'),
	'regexp_message' => __('Login should consist only small latin letters, numbers or undersores'),
	'regexp2_message' => __('Login format is invalid')
];
$password = [
	'unset_null' => true,
	'required' => false,
	'minlength' => 8,
	'maxlength' => 200,
	'modify' => function($pass) {
		return Hash::password($pass);
	},
	'required_message' => __('Password is required'),
	'minlength_message' => __('Password is too short'),
	'maxlength_message' => __('Password is too long')
];
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
$phone = [
	'required' => false,
	'minlength' => 8,
	'maxlength' => 100,
	'regexp' => '/^[0-9\+\-\(\)]*$/',
	'required_message' => __('Phone is required'),
	'minlength_message' => __('Phone is too short'),
	'maxlength_message' => __('Phone is too long'),
	'regexp_message' => __('Phone format is invalid')
];
$name = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[\w ]+$/iu',
	'required_message' => __('Name is required'),
	'minlength_message' => __('Name is too short'),
	'maxlength_message' => __('Name is too long'),
	'regexp_message' => __('Name should consist only letters and spaces')
];
$avatar = [
	'file' => true
];
$address = [
	'maxlength' => 200,
	'maxlength_message' => __('Address is too long')
];
$about = [
	'maxlength' => 1000,
	'maxlength_message' => __('About is too long')
];
$socials = [
	'json' => true
];
$birthday = [
	'date' => true,
	'date_not_future' => true,
	'date_not_future_message' => __('Birthday can not be a future date')
];
