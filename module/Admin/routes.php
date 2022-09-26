<?php

############################# UPLOAD #############################
Module::route('get', '/upload', 'Upload@get');
Module::route('post', '/upload', 'Upload@post');
Module::route('delete', '/upload', 'Upload@delete');

############################# AUTH #############################
Module::route('get', '/admin/login', 'Auth@getAuth', ['is_public' => true]);
Module::route('get', '/admin/logout', 'Auth@getUnAuth', ['is_public' => true]);
Module::route('get', '/admin/reset-password', 'Auth@getRestore', ['is_public' => true]);
Module::route('get', '/admin/register', 'Auth@getRegister', ['is_public' => true]);

############################# DASHBOARD #############################
Module::route('get', '/admin', 'Dashboard@getDashboard', ['is_public' => true]);
Module::route('get', '/admin/dashboard', 'Dashboard@getDashboard', ['is_public' => true]);

############################# PROFILE #############################
Module::route('get', '/admin/profile', 'Profile@getProfile', ['is_public' => true]);
Module::route('get', '/admin/profile/edit', 'Profile@getEdit', ['is_public' => true]);
Module::route('get', '/admin/profile/$id', 'Profile@getProfile');

Module::route('post', '/admin/profile/notification', 'Profile@postNotification');
Module::route('post', '/admin/profile/$id/notification', 'Profile@postNotification');

############################# CONTACT #############################
Module::route('get', '/admin/contact', 'Contact@getAll');

############################# PAGE #############################
Module::route('get', '/admin/page', 'Page@getAll');
Module::route('get', '/admin/page/category/$id', 'Page@getCategory');
Module::route('get', '/admin/page/add', 'Page@getAdd');
Module::route('get', '/admin/page/edit/$id', 'Page@getEdit');
Module::route('get', '/admin/page/edit/$id/translation/add/$language', 'Page@getAddTranslation');
Module::route('get', '/admin/page/edit/$id/translation/edit/$language', 'Page@getEdit');

############################# COMMENT #############################
Module::route('get', '/admin/comment', 'Comment@getAll');
Module::route('get', '/admin/comment/edit/$id', 'Comment@getEdit');

############################# MENU #############################
Module::route('get', '/admin/menu', 'Menu@getAll');
Module::route('get', '/admin/menu/$id', 'Menu@getEdit');

############################# TRANSLATION #############################
Module::route('get', '/admin/translation', 'Translation@getAll');
Module::route('get', '/admin/translation/$module/add', 'Translation@getAdd');
Module::route('get', '/admin/translation/$module/$language', 'Translation@getEdit');

Module::route('post', '/admin/translation/$module/add', 'Translation@postAdd');
Module::route('post', '/admin/translation/$module/$language', 'Translation@postEdit');

############################# USER #############################
Module::route('get', '/admin/user', 'User@getAll');
Module::route('get', '/admin/user/add', 'User@getAdd');
Module::route('get', '/admin/user/edit/$id', 'User@getEdit');

############################# GROUP #############################
Module::route('get', '/admin/group', 'Group@getAll');
Module::route('get', '/admin/group/add', 'Group@getAdd');
Module::route('get', '/admin/group/edit/$id', 'Group@getEdit');

############################# SETTING #############################
Module::route('get', '/admin/setting/$section', 'Setting@getSection');

Module::route('post', '/admin/setting/$section', 'Setting@postSection');
Module::route('post', '/admin/setting/optimization/flush-cache', 'Setting@postFlushCache');

############################# LOG #############################
Module::route('get', '/admin/log', 'Log@getAll');
Module::route('get', '/admin/log/$id', 'Log@get');

############################# MODULE #############################
Module::route('get', '/admin/module', 'Module@getAll');
Module::route('get', '/admin/module/edit/$name', 'Module@getEdit');

Module::route('post', '/admin/module/edit/$name', 'Module@postEdit');
Module::route('post', '/admin/module/delete/$name', 'Module@postDelete');
Module::route('post', '/admin/module/toggle/$name', 'Module@postToggle');
