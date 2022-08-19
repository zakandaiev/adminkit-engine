<?php

require Path::file('form') . '/_Model/Setting.php';

return [
	'table' => 'setting',
	'fields' => [
		'logo_admin' => $logo_admin,
		'logo_public' => $logo_public,
		'logo_alt' => $logo_alt,
		'icon' => $icon,
		'placeholder_avatar' => $placeholder_avatar,
		'placeholder_image' => $placeholder_image,
		'name' => $name,
		'description' => $description,
		'analytics_gtag' => $analytics_gtag,
		'pagination_limit' => $pagination_limit,
		'no_index_no_follow' => $no_index_no_follow
	]
];
