<?php

$language = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 8
];
$title = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 300
];
$url = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]+$/'
];
$author = [
	'required' => true,
	'int' => true
];
$template = [
	'maxlength' => 200,
	'regexp' => '/^[a-z0-9_\-]*$/'
];
$image = [
	'file' => true
];
$boolean = [
	'boolean' => true
];
$tags = [
	'foreign' => function($field_value, $form_data) {
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
				$statement->prepare()->bind(['name' => $name, 'url' => $url])->execute();

				$foreign_keys[] = $statement->insertId();
			}
		}

		$sql = 'DELETE FROM {page_tag} WHERE page_id=:page_id';

		$statement = new Statement($sql);
		$statement->prepare()->bind(['page_id' => $form_data['item_id']])->execute();

		foreach($foreign_keys as $key) {
			$sql = '
				INSERT INTO {page_tag}
					(page_id, tag_id)
				VALUES
					(:page_id, :tag_id)
			';
			
			$statement = new Statement($sql);
			$statement->prepare()->bind(['page_id' => $form_data['item_id'], 'tag_id' => $key])->execute();
		}

		return true;
	}
];
$custom_fields = [
	'foreign' => function($field_value, $form_data) {
		$binding = ['page_id' => $form_data['item_id']];

		if($form_data['action'] === 'edit') {
			$page_fields = new Statement('SELECT * FROM {custom_field} WHERE page_id=:page_id');
			$page_fields = $page_fields->prepare()->bind(['page_id' => $form_data['item_id']])->execute()->fetchAll();

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
				$delete->prepare()->bind($binding)->execute();
			}
		}

		foreach($field_value as $field) {
			$binding['name'] = keyword($field->name);

			$check_exist = new Statement('SELECT id FROM {custom_field} WHERE name=:name AND page_id=:page_id');
			$check_exist = $check_exist->prepare()->bind(['name' => $field->name, 'page_id' => $form_data['item_id']])->execute()->fetch();

			if($check_exist) {
				$sql = 'UPDATE {custom_field} SET value=:value WHERE name=:name AND page_id=:page_id';
			} else {
				$sql = 'INSERT INTO {custom_field} (name, value, page_id) VALUES (:name, :value, :page_id)';
			}

			$binding['value'] = $field->value;

			$statement = new Statement($sql);
			$statement->prepare()->bind($binding)->execute();
		}

		return true;
	}
];

return [
	'table' => 'page',
	'language' => 'form_page',
	'field' => [
		'language' => $language,
		'title' => $title,
		'excerpt' => [],
		'content' => [
			'html' => true
		],
		'tags' => $tags,
		'seo_description' => [],
		'seo_keywords' => [],
		'seo_image' => $image,
		'no_index_no_follow' => $boolean,
		'image' => $image,
		'gallery' => $image,
		'author' => $author,
		'is_category' => [
			'boolean' => true
		],
		'category' => [
			'foreign' => 'page_category@page_id/category_id'
		],
		'url' => $url,
		'template' => $template,
		'date_publish' => [
			'date' => true
		],
		'is_static' => $boolean,
		'allow_comment' => $boolean,
		'hide_comments' => $boolean,
		'enabled' => $boolean,
		'custom_fields' => $custom_fields
	],
	'execute_post' => function($fields, $form_data) {
		if($form_data['action'] !== 'add' || empty($form_data['item_id'])) {
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
	}
];
