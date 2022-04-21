<?php

############################# UPLOAD #############################
Module::route('get', '/upload', 'Upload@get');
Module::route('post', '/upload', 'Upload@post');
Module::route('delete', '/upload', 'Upload@delete');

############################# AUTH #############################
Module::route('get', '/admin/login', 'Authorization@getForm', true);
Module::route('get', '/admin/logout', 'Authorization@postUnAuth', true);
Module::route('post', '/admin/login', 'Authorization@postAuth', true);
Module::route('post', '/admin/logout', 'Authorization@postUnAuth', true);

Module::route('get', '/admin/reset-password', 'Authorization@getRestore', true);
Module::route('post', '/admin/reset-password', 'Authorization@postRestore', true);

Module::route('get', '/admin/register', 'Authorization@getRegister', true);
Module::route('post', '/admin/register', 'Authorization@postRegister', true);

############################# DASHBOARD #############################
Module::route('get', '/admin', 'Dashboard@getDashboard', true);
Module::route('get', '/admin/dashboard', 'Dashboard@getDashboard', true);

############################# PROFILE #############################
Module::route('get', '/admin/profile', 'Profile@getProfile', true);
Module::route('get', '/admin/profile/edit', 'Profile@getEdit', true);
Module::route('get', '/admin/profile/$id', 'Profile@getProfile');

############################# SETTING #############################
Module::route('get', '/admin/setting/$section', 'Setting@getSection');
Module::route('post', '/admin/setting/$section', 'Setting@postSection');

############################# PAGE #############################
Module::route('get', '/admin/page', 'Page@getAll');
Module::route('get', '/admin/page/category/$id', 'Page@getCategory');
Module::route('get', '/admin/page/add', 'Page@getAdd');
Module::route('get', '/admin/page/edit/$id', 'Page@getEdit');

############################# USER #############################
Module::route('get', '/admin/user', 'User@getAll');
Module::route('get', '/admin/user/add', 'User@getAdd');
Module::route('get', '/admin/user/edit/$id', 'User@getEdit');

############################# GROUP #############################
Module::route('get', '/admin/group', 'Group@getAll');
Module::route('get', '/admin/group/add', 'Group@getAdd');
Module::route('get', '/admin/group/edit/$id', 'Group@getEdit');
