<?php

define(
	'TRANSLATION',
	[
		'is_translation' => isset(Request::$post['is_translation']) ? true : false,
		'parent_fields' => [
			'is_category',
			'author',
			'url',
			'no_index_no_follow',
			'template',
			'date_publish',
			'allow_comment',
			'hide_comments',
			'is_enabled'
		]
	]
);

$language = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 8,
	'required_message' => 'Language is required',
	'minlength_message' => 'Language is too short',
	'maxlength_message' => 'Language is too long'
];
$title = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 300,
	'required_message' => 'Title is required',
	'minlength_message' => 'Title is too short',
	'maxlength_message' => 'Title is too long'
];
$url = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]+$/',
	'required_message' => 'URL Slug is required',
	'minlength_message' => 'URL Slug is too short',
	'maxlength_message' => 'URL Slug is too long',
	'regexp_message' => 'URL Slug should consist only small latin letters, numbers or dashes'
];
$author = [
	'required' => true,
	'int' => true,
	'required_message' => 'Author is required',
	'int_message' => 'Author format is invalid'
];
$template = [
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]*$/',
	'maxlength_message' => 'Template is too long',
	'regexp_message' => 'Template should consist only small latin letters, numbers or dashes'
];
$category = [
	'foreign' => 'page_category@page_id/category_id'
];
$content = [
	'html' => true
];
$image = [
	'file' => true
];
$boolean = [
	'boolean' => true
];
$date = [
	'date' => true
];
$tags = [
	'foreign' => function($field_value, $form_data) {
		updateTags($field_value, $form_data);
	}
];
$custom_fields = [
	'foreign' => function($field_value, $form_data) {
		updateCutomFields($field_value, $form_data);
	}
];

return [
	'table' => 'page',
	'fields' => [
		'language' => $language,
		'title' => $title,
		'excerpt' => [],
		'content' => $content,
		'tags' => $tags,
		'seo_description' => [],
		'seo_keywords' => [],
		'seo_image' => $image,
		'no_index_no_follow' => $boolean,
		'image' => $image,
		'author' => $author,
		'is_category' => $boolean,
		'category' => $category,
		'url' => $url,
		'template' => $template,
		'date_publish' => $date,
		'allow_comment' => $boolean,
		'hide_comments' => $boolean,
		'is_enabled' => $boolean,
		'custom_fields' => $custom_fields
	],
	'fields_modify' => function($fields, $form_data) {
		return modifyTranslationFields($fields, $form_data);
	},
	'execute_pre' => function($fields, $form_data) {
		deleteTranslations($fields, $form_data);
	},
	'execute_post' => function($fields, $form_data) {
		createNotification($fields, $form_data);
		updateTranslations($fields, $form_data);
		Sitemap::update();
	}
];

function createNotification($fields, $form_data) {
	if($form_data['action'] !== 'add') {
		return false;
	}

	$data = new \stdClass();
	$data->user_id = $fields['author'];
	$data->author = $fields['author'];
	$data->title = $fields['title'];
	$data->url = $fields['url'];
	$data->image = $fields['image'];
	$data->excerpt = $fields['excerpt'];

	$notification_kind = $fields['is_category'] ? 'category_add' : 'page_add';

	Notification::create($notification_kind, $data->user_id, $data);

	return true;
}

function modifyTranslationFields($fields, $form_data) {
	if($form_data['action'] === 'delete') {
		return $fields;
	}

	if(!TRANSLATION['is_translation']) {
		return $fields;
	}

	foreach(TRANSLATION['parent_fields'] as $field) {
		unset($fields[$field]);
	}

	return $fields;
}

function deleteTranslations($fields, $form_data) {
	if($form_data['action'] !== 'delete') {
		return false;
	}

	$sql = '
		DELETE FROM
			{page}
		WHERE
			url=(SELECT url FROM (SELECT * FROM {page}) as t_page WHERE id=:id)
	';

	$binding = [
		'id' => $form_data['item_id']
	];

	$statement = new Statement($sql);
	$statement->execute($binding);

	return true;
}

function updateTranslations($fields, $form_data) {
	if($form_data['action'] === 'delete') {
		return false;
	}

	if(TRANSLATION['is_translation']) {
		return false;
	}

	$sql_binding = array_reduce(array_values(TRANSLATION['parent_fields']),function($carry,$v){return ($carry?"$carry, ":'')."$v=:$v";});

	$binding = [
		'id' => $form_data['item_id']
	];

	foreach(TRANSLATION['parent_fields'] as $field) {
		$binding[$field] = $fields[$field];
	}

	$sql = '
		UPDATE
			{page}
		SET
			' . $sql_binding . '
		WHERE
			id<>:id AND url=:url
			AND language<>(SELECT value FROM {setting} WHERE section=\'main\' AND name=\'language\')
	';

	$statement = new Statement($sql);
	$statement->execute($binding);

	return true;
}

function updateTags($field_value, $form_data) {
	if(empty($field_value) || empty($form_data['item_id'])) {
		return false;
	}

	$foreign_keys = [];

	foreach($field_value as $value) {
		if(is_numeric($value)) {
			$foreign_keys[] = $value;
		} else {
			$name = word($value);

			if(empty($name)) {
				continue;
			}

			$url = slug($name);

			$sql = 'INSERT INTO {tag} (name, url) VALUES (:name, :url)';

			$statement = new Statement($sql);
			$statement->execute(['name' => $name, 'url' => $url]);

			$foreign_keys[] = $statement->insertId();
		}
	}

	$sql = 'DELETE FROM {page_tag} WHERE page_id=:page_id';

	$statement = new Statement($sql);
	$statement->execute(['page_id' => $form_data['item_id']]);

	foreach($foreign_keys as $key) {
		$sql = '
			INSERT INTO {page_tag}
				(page_id, tag_id)
			VALUES
				(:page_id, :tag_id)
		';

		$statement = new Statement($sql);
		$statement->execute(['page_id' => $form_data['item_id'], 'tag_id' => $key]);
	}

	return true;
}

function updateCutomFields($field_value, $form_data) {
	$binding = ['page_id' => $form_data['item_id']];

	if($form_data['action'] === 'edit') {
		$page_fields = new Statement('SELECT * FROM {custom_field} WHERE page_id=:page_id');
		$page_fields = $page_fields->execute(['page_id' => $form_data['item_id']])->fetchAll();

		foreach($page_fields as $p_key => $p_field) {
			foreach($field_value as $key => $field) {
				if($field->name === $p_field->name) {
					unset($page_fields[$p_key]);
				}
			}
		}

		foreach($page_fields as $field) {
			$binding['name'] = $field->name;

			$sql = 'DELETE FROM {custom_field} WHERE name=:name AND page_id=:page_id';

			$delete = new Statement($sql);
			$delete->execute($binding);
		}
	}

	foreach($field_value as $field) {
		$binding['name'] = keyword($field->name);

		$check_exist = new Statement('SELECT id FROM {custom_field} WHERE name=:name AND page_id=:page_id');
		$check_exist = $check_exist->execute(['name' => $field->name, 'page_id' => $form_data['item_id']])->fetch();

		if($check_exist) {
			$sql = 'UPDATE {custom_field} SET value=:value WHERE name=:name AND page_id=:page_id';
		} else {
			$sql = 'INSERT INTO {custom_field} (name, value, page_id) VALUES (:name, :value, :page_id)';
		}

		$binding['value'] = $field->value;

		$statement = new Statement($sql);
		$statement->execute($binding);
	}

	return true;
}
