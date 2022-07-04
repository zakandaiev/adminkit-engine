<?php

############################# PAGE #############################
$url = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9\-]+$/',
	'required_message' => __('URL slug is required'),
	'minlength_message' => __('URL slug is too short'),
	'maxlength_message' => __('URL slug is too long'),
	'regexp_message' => __('URL slug should consist only small latin letters, numbers or dashes')
];
$author = [
	'required' => true,
	'int' => true,
	'required_message' => __('Author is required'),
	'int_message' => __('Author format is invalid')
];
$template = [
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]*$/',
	'maxlength_message' => __('Template is too long'),
	'regexp_message' => __('Template should consist only small latin letters, numbers, underscores or dashes')
];
$date_publish = [
	'date' => true
];
$is_category = [
	'boolean' => true
];
$no_index_no_follow = [
	'boolean' => true
];
$allow_comment = [
	'boolean' => true
];
$hide_comments = [
	'boolean' => true
];
$is_enabled = [
	'boolean' => true
];
$category = [
	'foreign' => 'page_category@page_id/category_id'
];

############################# TRANSLATION #############################
$language = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 8,
	'required_message' => __('Language is required'),
	'minlength_message' => __('Language is too short'),
	'maxlength_message' => __('Language is too long')
];
$title = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 300,
	'required_message' => __('Title is required'),
	'minlength_message' => __('Title is too short'),
	'maxlength_message' => __('Title is too long')
];
$content = [
	'html' => true
];
$excerpt = [
	'maxlength' => 500,
	'maxlength_message' => __('Excerpt is too long')
];
$image = [
	'file' => true
];
$seo_description = [];
$seo_keywords = [];
$seo_image = [
	'file' => true
];
$tags = [];
$custom_fields = [];
