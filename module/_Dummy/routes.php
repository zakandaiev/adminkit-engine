<?php

############################# DIVIDE SECTION #############################
Module::route('get', '/page-url/sub-url/$parameter', 'ControllerName@controllerMethod',
	[
		// Options array
		// Ex. access to the route ignoring user groups [used in Module\Admin\Controller\AdminController]
		'is_public' => false
	]
);

Module::route('get', '/controller-closure-example', function($data) {
	debug($data);
});

Module::route('post', '/post-page-url', 'ControllerName@controllerMethod');
