<?php

return [
	// 'key_name_from_uri@column_name_in_db@additional_columns' => 'filter_type',
	// key_name_from_uri = $_GET['key_name_from_uri']
	// filter_types: boolean, date, order, text, >, >=, <, '<=, =
	// examples below:
	'search@title@excerpt@content' => 'text',
	'author@author' => '=',
	'created@date_created' => 'date',
	'active@is_enabled' => 'boolean',

	'oauthor@author_name' => 'order',
	'opage@page_title' => 'order',
	'ocreated@date_created' => 'order',
	'active@is_enabled' => 'order'
];
