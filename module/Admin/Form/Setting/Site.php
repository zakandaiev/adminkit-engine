<?php

$name = [
	'required' => true,
	'maxlength' => 300
];
$description = [
	'required' => false,
	'maxlength' => 1000
];
$analytics_gtag = [
	'required' => false,
	'maxlength' => 30
];
$image = [
	'file' => true
];
$pagination_limit = [
	'int' => true
];
$no_index_no_follow = [
	'boolean' => true
];

return [
	'table' => 'setting',
	'field' => [
		'logo_admin' => $image,
		'logo_public' => $image,
		'logo_alt' => $image,
		'placeholder_avatar' => $image,
		'placeholder_image' => $image,
		'name' => $name,
		'description' => $description,
		'analytics_gtag' => $analytics_gtag,
		'pagination_limit' => $pagination_limit,
		'no_index_no_follow' => $no_index_no_follow
	]
];
