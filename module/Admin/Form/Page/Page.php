<?php

require Path::file('form') . '/_Model/Page.php';

return [
	'table' => 'page',
	'fields' => [
		'url' => $url,
		'author' => $author,
		'template' => $template,
		'date_publish' => $date_publish,
		'is_category' => $is_category,
		'no_index_no_follow' => $no_index_no_follow,
		'allow_comment' => $allow_comment,
		'hide_comments' => $hide_comments,
		'is_enabled' => $is_enabled,
		'category' => $category
	],
	'execute_post' => function($data) {
		Form::execute($data->form_data['action'], 'Page/Translation', $data->form_data['item_id'], true);
	}
];
