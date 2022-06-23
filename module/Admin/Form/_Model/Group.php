<?php

$name = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200,
	'regexp' => '/^[\w]+$/u',
	'required_message' => __('Name is required'),
	'minlength_message' => __('Name is too short'),
	'maxlength_message' => __('Name is too long'),
	'regexp_message' => __('Name should consist only letters')
];
$routes = [
	'foreign' => 'group_route@group_id/route'
];
$users = [
	'foreign' => 'user_group@group_id/user_id'
];
$access_all = [
	'boolean' => true
];
$is_enabled = [
	'boolean' => true
];
