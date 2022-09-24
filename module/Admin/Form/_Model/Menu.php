<?php

$name = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_]+$/u',
	'required_message' => __('Name is required'),
	'minlength_message' => __('Name is too short'),
	'maxlength_message' => __('Name is too long'),
	'regexp_message' => __('Name should consist only small latin letters, numbers or underscores')
];

$language = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 8,
	'required_message' => __('Language is required'),
	'minlength_message' => __('Language is too short'),
	'maxlength_message' => __('Language is too long')
];

$items = [
	'json' => true
];
