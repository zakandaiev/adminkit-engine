<?php

$key = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 2,
	'regexp' => '/^[a-z]+$/',
	'required_message' => __('Key is required'),
	'minlength_message' => __('Key is too short'),
	'maxlength_message' => __('Key is too long'),
	'regexp_message' => __('Key should consist only small latin letters')
];
$region = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 2,
	'regexp' => '/^[A-Z]+$/',
	'required_message' => __('Region is required'),
	'minlength_message' => __('Region is too short'),
	'maxlength_message' => __('Region is too long'),
	'regexp_message' => __('Region should consist only big latin letters')
];
$name = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 32,
	'regexp' => '/^[\w]+$/iu',
	'required_message' => __('Name is required'),
	'minlength_message' => __('Name is too short'),
	'maxlength_message' => __('Name is too long'),
	'regexp_message' => __('Name should consist only latin letters')
];
$icon = [
	'file' => true,
	'extensions' => ['jpg','png','svg']
];
