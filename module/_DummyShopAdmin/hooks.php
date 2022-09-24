<?php

############################# REGISTER #############################


############################# RUN #############################
Hook::run('admin_sidebar_append_after', '/admin/translation', [
	'icon' => 'shopping-cart',
	'name' => __('Shop'),
	'route' => [
		__('Products') => '/admin/shop/product',
		__('Characteristics') => '/admin/shop/characteristic',
		__('Purchase history') => '/admin/shop/purchase-history',
		__('Statistics') => '/admin/shop/statistic',
		__('Settings') => '/admin/shop/setting'
	]
]);
