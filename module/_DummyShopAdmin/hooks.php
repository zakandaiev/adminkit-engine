<?php

############################# REGISTER #############################


############################# RUN #############################
$sidebar = [];

foreach($GLOBALS['admin_sidebar'] as $route) {
	$sidebar[] = $route;

	if(is_string($route['route']) && $route['route'] === '/admin/translation') {
		$sidebar[] = [
			'icon' => 'shopping-cart',
			'name' => __('Shop'),
			'route' => [
				__('Products') => '/admin/shop/product',
				__('Characteristics') => '/admin/shop/characteristic',
				__('Purchase history') => '/admin/shop/purchase-history',
				__('Statistics') => '/admin/shop/statistic',
				__('Settings') => '/admin/shop/setting'
			]
		];
	}
}

Hook::run('admin_sidebar_modify', $sidebar);
