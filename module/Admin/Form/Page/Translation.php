<?php

require Path::file('form') . '/_Model/Page.php';

$tags = [
	'foreign' => function($field_value, $data) {
		updateTags($field_value, $data);
	}
];
$custom_fields = [
	'foreign' => function($field_value, $data) {
		updateCutomFields($field_value, $data);
	}
];

return [
	'table' => 'page_translation',
	'fields' => [
		'language' => $language,
		'title' => $title,
		'content' => $content,
		'excerpt' => $excerpt,
		'image' => $image,
		'seo_description' => $seo_description,
		'seo_keywords' => $seo_keywords,
		'seo_image' => $seo_image,
		'tags' => $tags,
		'custom_fields' => $custom_fields
	],
	'modify_fields' => function($data) {
		$data->fields['page_id'] = $data->form_data['item_id'];
		return $data;
	},
	'modify_sql' => function($data) {
		if($data->form_data['action'] === 'edit') {
			$data->sql .= ' AND language = :language';
		}
		return $data;
	},
	'execute_post' => function($data) {
		Hook::run('page_' . $data->form_data['action'], $data);
	}
];

function updateTags($tags, $data) {
	if(empty($tags) || empty($data->form_data['item_id'])) {
		return false;
	}

	$foreign_keys = [];

	foreach($tags as $value) {
		if(is_numeric($value)) {
			$foreign_keys[] = $value;
		} else {
			$name = word($value);

			if(empty($name)) {
				continue;
			}

			$url = slug($name);
			$language = $data->fields['language'];

			$sql = 'INSERT INTO {tag} (language, name, url) VALUES (:language, :name, :url)';

			$statement = new Statement($sql);
			$statement->execute(['language' => $language, 'name' => $name, 'url' => $url]);

			$foreign_keys[] = $statement->insertId();
		}
	}

	$sql = '
		DELETE FROM
			{page_tag}
		WHERE
			page_id = :page_id
			AND tag_id IN
				(SELECT id FROM {tag} WHERE language = :language)
	';

	$statement = new Statement($sql);
	$statement->execute(['page_id' => $data->form_data['item_id'], 'language' => $data->fields['language']]);

	foreach($foreign_keys as $tag_id) {
		$sql = '
			INSERT INTO {page_tag}
				(page_id, tag_id)
			VALUES
				(:page_id, :tag_id)
		';

		$statement = new Statement($sql);
		$statement->execute(['page_id' => $data->form_data['item_id'], 'tag_id' => $tag_id]);
	}

	return true;
}

function updateCutomFields($field_value, $data) {
	$fields = [];

	Module::setName('Public');

	foreach(\Module\Admin\Model\Page::getInstance()->getPageCustomFieldSets($data->form_data['item_id']) as $fieldset) {
		$form_name = 'CustomFields/' . file_name($fieldset);

		Form::check($form_name);

		$fields = array_merge($fields, Form::processFields($form_name));
	}

	Module::setName('Admin');

	$binding = ['page_id' => $data->form_data['item_id'], 'language' => $data->fields['language']];

	foreach($fields as $name => $value) {
		$binding['name'] = slug($name, '_');
		unset($binding['value']);

		$check_exist = new Statement('SELECT id FROM {custom_field} WHERE name = :name AND page_id = :page_id AND language = :language');
		$check_exist = $check_exist->execute($binding)->fetch();

		if($check_exist) {
			$sql = 'UPDATE {custom_field} SET value = :value WHERE name = :name AND page_id = :page_id AND language = :language';
		} else {
			$sql = 'INSERT INTO {custom_field} (name, value, page_id, language) VALUES (:name, :value, :page_id, :language)';
		}

		$binding['value'] = $value;

		$statement = new Statement($sql);
		$statement->execute($binding);
	}

	return true;
}
