<?php

Module::route('get', '/admin/shop/product', 'Shop@getProducts', [
	'page' => [
		'title' => __('Products')
	],
	'breadcrumbs' => [
		__('Shop') . '@/admin/shop/setting',
		__('Products')
	]
]);
