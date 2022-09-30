<?php

############################# MAIN #############################
$language = [
	'required' => true,
	'required_message' => __('Language is required')
];
$socials_allowed = [];
$enable_registration = [
	'boolean' => true
];
$enable_password_restore = [
	'boolean' => true
];
$moderate_comments = [
	'boolean' => true
];

############################# SITE #############################
$logo_admin = [
	'file' => true
];
$logo_public = [
	'file' => true
];
$logo_alt = [
	'file' => true
];
$icon = [
	'file' => true,
	'extensions' => ['png','svg','ico']
];
$placeholder_avatar = [
	'file' => true
];
$placeholder_image = [
	'file' => true
];
$name = [
	'required' => true,
	'maxlength' => 300,
	'required_message' => __('Name is required'),
	'maxlength_message' => __('Name is too long')
];
$description = [
	'required' => false,
	'maxlength' => 1000,
	'required_message' => __('Description is required'),
	'maxlength_message' => __('Description is too long')
];
$analytics_gtag = [
	'required' => false,
	'maxlength' => 30,
	'maxlength_message' => __('Google analytics tag is too long')
];
$pagination_limit = [
	'int' => true,
	'int_message' => __('Pagination limit format is invalid')
];
$no_index_no_follow = [
	'boolean' => true
];

############################# CONTACT #############################
$address = [
	'required' => false,
	'maxlength' => 200,
	'maxlength_message' => __('Address is too long')
];
$coordinate_x = [
	'required' => false,
	'float' => true,
	'float_message' => __('Coordinate X format is invalid')
];
$coordinate_y = [
	'required' => false,
	'float' => true,
	'float_message' => __('Coordinate Y format is invalid')
];
$hours = [
	'required' => false,
	'maxlength' => 200,
	'maxlength_message' => __('Work hours is too long')
];
$email = [
	'email' => true,
	'email_message' => __('Email format is invalid')
];
$phones = [
	'json' => true
];

############################# OPTIMIZATION #############################
$group_css = [
	'boolean' => true
];
$group_js = [
	'boolean' => true
];
$cache_db = [
	'boolean' => true
];
