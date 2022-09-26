<?php

namespace Module\Admin\Model;

use Engine\Path;
use Engine\Database\Statement;

class Page extends \Engine\Model {
	public function createTranslation($data) {
		$columns = implode(', ', array_keys($data));
		$bindings = ':' . implode(', :', array_keys($data));
		$sql = 'INSERT INTO {page_translation} (' . $columns . ') VALUES (' . $bindings . ')';

		$statement = new Statement($sql);
		$statement->execute($data);

		return true;
	}

	public function getPages() {
		$sql = '
			SELECT
				*,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_page.author) as author_name,
				(CASE WHEN t_page.date_publish > NOW() THEN true ELSE false END) as is_pending,
				(SELECT GROUP_CONCAT(language) FROM {page_translation} WHERE page_id=t_page.id AND language<>:language) as translations
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language = :language
				AND (SELECT count(*) FROM {page_category} WHERE page_id=t_page.id) = 0
			ORDER BY
				t_page.is_category=false, t_page.date_publish DESC
		';

		$pages = new Statement($sql);

		$pages = $pages->filter('Page')->paginate()->execute(['language' => site('language')])->fetchAll();

		foreach($pages as $key => $page) {
			$page->translations = !empty($page->translations) ? explode(',', $page->translations) : [];
		}

		return $pages;
	}

	public function getPagesByCategory($id) {
		$sql = '
			SELECT
				t_page.*, t_page_translation.*,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_page.author) as author_name,
				(CASE WHEN t_page.date_publish > NOW() THEN true ELSE false END) as is_pending,
				(SELECT GROUP_CONCAT(language) FROM {page_translation} WHERE page_id=t_page.id AND language<>:language) as translations
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.page_id
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_category.category_id = :category_id
				AND t_page_translation.language = :language
			ORDER BY
				t_page.is_category=false, t_page.date_publish DESC
		';

		$pages = new Statement($sql);

		$pages = $pages->filter('Page')->paginate()->execute(['category_id' => $id, 'language' => site('language')])->fetchAll();

		foreach($pages as $key => $page) {
			$page->translations = !empty($page->translations) ? explode(',', $page->translations) : [];
		}

		return $pages;
	}

	public static function getPage($key, $language = null) {
		if(is_numeric($key)) {
			$binding_key = 'id';
		} else {
			$binding_key = 'url';
		}

		$binding = [
			$binding_key => $key,
			'language' => $language ?? site('language')
		];

		$sql = "
			SELECT
				*
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				{$binding_key} = :{$binding_key}
				AND t_page_translation.language = :language
		";

		$page = new Statement($sql);

		return $page->execute($binding)->fetch();
	}

	public function getAuthors() {
		$sql = 'SELECT * FROM {user} ORDER BY name ASC, login ASC';

		$authors = new Statement($sql);

		return $authors->execute()->fetchAll();
	}

	public function getCategories($current = 0) {
		$sql = '
			SELECT
				*
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language = :language
				AND is_category IS true
				AND id <> :id
			ORDER BY
				title ASC
		';

		$categories = new Statement($sql);

		return $categories->execute(['id' => $current, 'language' => site('language')])->fetchAll();
	}

	public function getTags($language = null) {
		$sql = 'SELECT * FROM {tag} WHERE language = :language ORDER BY name ASC';

		$tags = new Statement($sql);

		return $tags->execute(['language' => $language ?? site('language')])->fetchAll();
	}

	public function getPageCategories($page_id) {
		$categories = [];

		$sql = 'SELECT category_id FROM {page_category} WHERE page_id = :page_id';

		$statement = new Statement($sql);

		foreach($statement->execute(['page_id' => $page_id])->fetchAll() as $category) {
			$categories[] = $category->category_id;
		}

		return $categories;
	}

	public function getPageTags($page_id, $language = null) {
		$tags = [];

		$sql = '
			SELECT
				t_tag.id
			FROM
				{tag} t_tag
			INNER JOIN
				{page_tag} t_page_tag
			ON
				t_tag.id = t_page_tag.tag_id
			WHERE
				t_page_tag.page_id = :page_id
				AND t_tag.language = :language
		';

		$statement = new Statement($sql);

		foreach($statement->execute(['page_id' => $page_id, 'language' => $language ?? site('language')])->fetchAll() as $tag) {
			$tags[] = $tag->id;
		}

		return $tags;
	}

	public function getPageCustomFields($page_id, $language = null) {
		$sql = '
			SELECT
				name, value
			FROM
				{custom_field}
			WHERE
				page_id = :page_id
				AND language = :language
		';

		$custom_fields = new Statement($sql);

		$fields = new \stdClass();

		foreach($custom_fields->execute(['page_id' => $page_id, 'language' => $language ?? site('language')])->fetchAll() as $field) {
			$fields->{$field->name} = $field->value;
		}

		return $fields;
	}

	public function getPageCustomFieldSets($page = null) {
		$fieldsets = [];

		$path_fields = Path::file('custom_fields');

		if(!file_exists($path_fields)) {
			return $fieldsets;
		}

		foreach(scandir($path_fields) as $fieldset) {
			if(in_array($fieldset, ['.', '..'], true)) continue;

			if(file_extension($fieldset) !== 'php') continue;

			$file_name = strtolower(file_name($fieldset));

			@list($type, $value) = explode('-', $file_name, 2);

			if($type === 'all') {
				$fieldsets[] = $path_fields . '/' . $fieldset;
			}

			if(empty((array) $page)) {
				continue;
			}

			if(!is_object($page) && is_numeric($page)) {
				$page = $this->getPage($page);
			}

			if(!isset($page->categories)) {
				$page->categories = $this->getPageCategories($page->id);
			}

			if(
				($type === 'id' && $value === $page->id)
				|| ($type === 'category' && in_array($value, $page->categories))
				|| ($type === 'template' && $value === $page->template)
			) {
				$fieldsets[] = $path_fields . '/' . $fieldset;
			}
		}

		return $fieldsets;
	}
}
