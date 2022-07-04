<?php

############################# PAGE #############################
Module::route('get', '/', 'Page@getPage');
Module::route('get', '/$url', 'Page@getPage');

############################# TAG #############################
Module::route('get', '/tag/$url', 'Page@getTag');

############################# AUTHOR #############################
Module::route('get', '/author/$id', 'Page@getAuthor');
