<?php

$url = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]+$/',
	'required_message' => 'URL Slug is required',
	'minlength_message' => 'URL Slug is too short',
	'maxlength_message' => 'URL Slug is too long',
	'regexp_message' => 'URL Slug should consist only small latin letters, numbers or dashes'
];
$author = [
	'required' => true,
	'int' => true,
	'required_message' => 'Author is required',
	'int_message' => 'Author format is invalid'
];
$template = [
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]*$/',
	'maxlength_message' => 'Template is too long',
	'regexp_message' => 'Template should consist only small latin letters, numbers or dashes'
];
$date_publish = [
	'date' => true
];
$category = [
	'foreign' => 'page_category@page_id/category_id'
];
$boolean = [
	'boolean' => true
];

return [
	'table' => 'page',
	'fields' => [
		'url' => $url,
		'author' => $author,
		'template' => $template,
		'date_publish' => $date_publish,
		'is_category' => $boolean,
		'no_index_no_follow' => $boolean,
		'allow_comment' => $boolean,
		'hide_comments' => $boolean,
		'is_enabled' => $boolean,
		'category' => $category
	],
	'execute_post' => function($data) {
		Form::execute($data->form_data['action'], 'PageTranslation', $data->form_data['item_id'], true);
		Sitemap::update();
	}
];
