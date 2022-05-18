<?php

############################# DIVIDE SECTION #############################
Module::route('get', '/page-url/sub-url/$parameter', 'ControllerName@controllerMethod', [
	// Page meta [abstract Engine\Controller]
	'page' => [
		'title' => 'Page A -> B -> C',
		'seo_description' => '',
		'seo_keywords' => '',
		'seo_image' => '',
		'no_index_no_follow' => false
	],
	// Breadcrumbs [abstract Engine\Controller]
	'breadcrumbs' => [
		// aviable use short format 'name@url' or array
		'Page A@/page-url', // is equal to ['name' => 'Page A', 'url' => '/page-url']
		['name' => 'Page A -> B', 'url' => '/page-url/sub-url'],
		['name' => 'Page A -> B -> C']
	],
	// Access to page ignoring user groups [Module\Admin\Controller\AdminController]
	'is_public' => false
]);

Module::route('post', '/post-page-url', 'ControllerName@controllerMethod');
