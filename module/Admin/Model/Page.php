<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class Page {
	public function createPage($data) {
		$columns = implode(', ', array_keys($data));
		$bindings = ':' . implode(', :', array_keys($data));
		$sql = 'INSERT INTO {page} (' . $columns . ') VALUES (' . $bindings . ')';

		$statement = new Statement($sql);
		$statement->prepare()->bind($data)->execute();

		return $statement->insertId();
	}

	public function countPages() {
		$sql = '
			SELECT
				COUNT(*)
			FROM
				{page} t_page
			WHERE
				(SELECT count(*) FROM {page_category} WHERE page_id=t_page.id) = 0
				AND language=:language
		';

		$statement = new Statement($sql);

		return $statement->prepare()->bind(['language' => site('language')])->execute()->fetchColumn();
	}

	public function getPages($pagination) {
		$sql = '
			SELECT
				t_page.*,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_page.author) as author_name,
				(CASE WHEN t_page.date_publish > NOW() THEN true ELSE false END) as is_pending,
				(SELECT JSON_ARRAYAGG(JSON_OBJECT(language, id)) FROM {page} WHERE url=t_page.url AND language<>t_page.language) as translations
			FROM
				{page} t_page
			WHERE
				(SELECT count(*) FROM {page_category} WHERE page_id=t_page.id) = 0
				AND t_page.language=:language
			ORDER BY
				t_page.is_category=false, t_page.date_publish DESC
		';

		$pages = new Statement($sql);

		$pages = $pages->paginate($pagination)->bind(['language' => site('language')])->execute()->fetchAll();

		foreach($pages as $key => $page) {
			$page->translations = json_decode($page->translations, true) ?? [];

			foreach($page->translations as $language => $page_id) {
				$page->translations[key($page_id)] = $page_id[key($page_id)];
				unset($page->translations[$language]);
			}

			$pages[$key] = $page;
		}

		return $pages;
	}
	public function countPagesInCategory($id) {
		$sql = '
			SELECT
				COUNT(*)
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.page_id
			WHERE
				t_page_category.category_id=:category_id
				AND t_page.language=:language
		';

		$statement = new Statement($sql);

		return $statement->prepare()->bind(['category_id' => $id, 'language' => site('language')])->execute()->fetchColumn();
	}

	public function getPagesByCategory($id, $pagination) {
		$sql = '
			SELECT
				t_page.*,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_page.author) as author_name,
				(CASE WHEN t_page.date_publish > NOW() THEN true ELSE false END) as is_pending,
				(SELECT JSON_ARRAYAGG(JSON_OBJECT(language, id)) FROM {page} WHERE url=t_page.url AND language<>t_page.language) as translations
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.page_id
			WHERE
				t_page_category.category_id=:category_id
				AND t_page.language=:language
			ORDER BY
				t_page.is_category=false, t_page.date_publish DESC
		';

		$pages = new Statement($sql);

		$pages = $pages->paginate($pagination)->bind(['category_id' => $id, 'language' => site('language')])->execute()->fetchAll();

		foreach($pages as $key => $page) {
			$page->translations = json_decode($page->translations, true) ?? [];

			foreach($page->translations as $language => $page_id) {
				$page->translations[key($page_id)] = $page_id[key($page_id)];
				unset($page->translations[$language]);
			}

			$pages[$key] = $page;
		}

		return $pages;
	}

	public function getPageById($id) {
		$sql = 'SELECT * FROM {page} WHERE id=:id';

		$page = new Statement($sql);

		return $page->prepare()->bind(['id' => $id])->execute()->fetch();
	}

	public function getAuthors() {
		$sql = 'SELECT * FROM {user} ORDER BY name ASC, login ASC';

		$authors = new Statement($sql);

		return $authors->prepare()->execute()->fetchAll();
	}

	public function getCategories($current = 0) {
		$sql = '
			SELECT
				id, title
			FROM
				{page}
			WHERE
				is_category IS true AND id<>:id
				AND language=:language
			ORDER BY
				title ASC
		';

		$categories = new Statement($sql);

		return $categories->prepare()->bind(['id' => $current, 'language' => site('language')])->execute()->fetchAll();
	}

	public function getTags() {
		$sql = 'SELECT * FROM {tag} ORDER BY name ASC';

		$tags = new Statement($sql);

		return $tags->prepare()->execute()->fetchAll();
	}

	public function getPageCategories($page_id) {
		$categories = [];

		$sql = 'SELECT category_id FROM {page_category} WHERE page_id=:page_id';

		$statement = new Statement($sql);

		foreach($statement->prepare()->bind(['page_id' => $page_id])->execute()->fetchAll() as $category) {
			$categories[] = $category->category_id;
		}

		return $categories;
	}

	public function getPageTags($page_id) {
		$tags = [];

		$sql = 'SELECT tag_id FROM {page_tag} WHERE page_id=:page_id';

		$statement = new Statement($sql);

		foreach($statement->prepare()->bind(['page_id' => $page_id])->execute()->fetchAll() as $tag) {
			$tags[] = $tag->tag_id;
		}

		return $tags;
	}

	public function getPageCustomFields($page_id) {
		$sql = 'SELECT name, value FROM {custom_field} WHERE page_id=:page_id';

		$custom_fields = new Statement($sql);

		return $custom_fields->prepare()->bind(['page_id' => $page_id])->execute()->fetchAll();
	}
}
