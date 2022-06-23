<?php

namespace Module\Public\Model;

use Engine\Database\Statement;

class Page extends \Engine\Model {
	public function updateViewCounter($page_id) {
		$sql = 'UPDATE {page} SET views = views + 1 WHERE id = :page_id';

		$statement = new Statement($sql);

		$statement->execute(['page_id' => $page_id]);

		return true;
	}

	public static function getPage($key, $language = null) {
		if(is_numeric($key)) {
			$binding_key = 'id';
		} else {
			$binding_key = 'url';
		}

		$binding = [
			$binding_key => $key,
			'language' => $language ?? site('language_current')
		];

		$sql = "
			SELECT
				*,
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				{$binding_key} = :{$binding_key}
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} pt INNER JOIN pre_page p ON p.id = pt.page_id WHERE {$binding_key} = :{$binding_key} AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
		";

		$page = new Statement($sql);

		return $page->execute($binding)->fetch();
	}

	public function getPageCategories($page_id, $language = null) {
		$sql = "
			SELECT
				*
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.category_id
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_category.page_id = (SELECT id FROM {page} WHERE id = :page_id)
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page_category.category_id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND t_page.date_publish <= NOW()
				AND t_page.is_enabled IS true
		";

		$statement = new Statement($sql);

		return $statement->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getPageTags($page_id, $language = null) {
		$sql = '
			SELECT
				t_tag.name, t_tag.url
			FROM
				{tag} t_tag
			INNER JOIN
				{page_tag} t_page_tag
			ON
				t_tag.id = t_page_tag.tag_id
			WHERE
				t_tag.language = :language
				AND t_page_tag.page_id = :page_id
				AND t_tag.is_enabled IS true
		';

		$statement = new Statement($sql);

		return $statement->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getPageCommentsCount($page_id) {
		$sql = 'SELECT count(*) as count FROM {comment} WHERE page_id = :page_id';

		$count = new Statement($sql);

		return intval($count->execute(['page_id' => $page_id])->fetchColumn());
	}

	public function getPageComments($page_id) {
		$sql = '
			SELECT
				t_comment.*, t_user.name as author_name, t_user.avatar as author_avatar
			FROM
				{comment} t_comment
			LEFT JOIN
				{user} t_user
			ON
				t_user.id=t_comment.author
			WHERE
				t_comment.page_id = :page_id
				AND t_comment.is_approved IS true
		';

		$statement = new Statement($sql);

		$comments = $statement->execute(['page_id' => $page_id])->fetchAll(\PDO::FETCH_ASSOC);

		$comments_formatted = [];
		foreach($comments as $item) {
			$item['children'] = [];
			$comments_formatted[$item['id']] = $item;
		}

		foreach($comments_formatted as $k => &$v) {
			if(@$v['parent'] != 0) {
				$comments_formatted[$v['parent']]['children'][] =& $v;
			}
		}
		unset($v);

		foreach($comments_formatted as $k => $v) {
			if(@$v['parent'] != 0 || !isset($v['id'])) {
				unset($comments_formatted[$k]);
			}
		}

		return $comments_formatted;
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

		foreach($custom_fields->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetchAll() as $field) {
			$fields->{$field->name} = $field->value;
		}

		return $fields;
	}

	public function getPages($options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 'date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				{$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getPagesInCategory($category_id, $options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 't_page.date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
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
				t_page_category.category_id IN ($category_id)
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND t_page.date_publish <= NOW()
				AND t_page.is_enabled IS true
				AND t_page.is_category IS false
				{$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getPagePrevNext($page_id, $category_id = null, $language = null) {
		$sql = '
			SELECT
				JSON_OBJECT(
					"title", prev_title,
					"url", prev_url,
					"image", prev_image
				) as page_prev,
				JSON_OBJECT(
					"title", next_title,
					"url", next_url,
					"image", next_image
				) as page_next
			FROM (
				SELECT id,
					LAG(title) OVER (ORDER BY date_publish) as prev_title,
					LAG(url) OVER (ORDER BY date_publish) as prev_url,
					LAG(image) OVER (ORDER BY date_publish) as prev_image,
					LEAD(title) OVER (ORDER BY date_publish) as next_title,
					LEAD(url) OVER (ORDER BY date_publish) as next_url,
					LEAD(image) OVER (ORDER BY date_publish) as next_image
				FROM
					{page} t_page
				INNER JOIN
					{page_category} t_page_category
				ON
					t_page.id = t_page_category.category_id
				INNER JOIN
					{page_translation} t_page_translation
				ON
					t_page.id = t_page_translation.page_id
				WHERE
					t_page_category.page_id = (SELECT id FROM {page} WHERE id = :page_id)
					AND t_page_translation.language =
						(CASE WHEN
							(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
						THEN
							:language
						ELSE
							(SELECT value FROM {setting} WHERE section = \'main\' AND name = \'language\')
						END)
					AND date_publish <= NOW()
					AND is_enabled IS true
					AND is_category IS false
					AND is_static IS false
			) t
			WHERE id = :page_id
		';

		$pages = new Statement($sql);

		$pages = $pages->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetch();

		$prev_next = new \stdClass();

		$prev_next->prev = @json_decode($pages->page_prev);
		$prev_next->next = @json_decode($pages->page_next);

		return $prev_next;
	}

	public function getAuthor($user_id) {
		$sql = 'SELECT id, name, address, avatar, about, socials FROM {user} WHERE id = :user_id';

		$author = new Statement($sql);

		return $author->execute(['user_id' => $user_id])->fetch();
	}

	public function getPagesByAuthor($user_id, $options = []) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 'date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page.author = :user_id
				AND t_page.date_publish <= NOW()
				AND t_page.is_enabled IS true
				AND t_page.is_category IS false
				AND t_page.is_static IS false {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['user_id' => $user_id])->fetchAll();
	}

	public function getRelatedPages($page, $options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 'date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS false
				{$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getMVP($options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? ', ' . $options['order'] : '',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS false
				AND is_static IS false
				{$options['where']}
			ORDER BY
				views DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getMCP($options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? ', ' . $options['order'] : '',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name,
				(SELECT count(*) FROM {comment} WHERE page_id=t_page.id) as count_comments
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS false
				AND is_static IS false
				{$options['where']}
			ORDER BY
				count_comments DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getCategories($options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 'count_pages DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name,
				(SELECT count(*) FROM {page_category} WHERE category_id=t_page.id) as count_pages
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS true
				{$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getTags($options = [], $language = null) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? ', ' . $options['order'] : '',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT count(*) FROM {page_tag} WHERE tag_id = t_tag.id) as count_pages
			FROM
				{tag} t_tag
			WHERE
				language = :language
				AND is_enabled IS true {$options['where']}
			ORDER BY
				count_pages DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute(['language' => $language ?? site('language_current')])->fetchAll();
	}

	public function getTagByUrl($url, $language = null) {
		$sql = '
			SELECT
				*
			FROM
				{tag} t_tag
			WHERE
				language = :language
				AND url = :url
				AND is_enabled IS true
		';

		$page = new Statement($sql);

		return $page->execute(['url' => $url, 'language' => $language ?? site('language_current')])->fetch();
	}

	public function getPagesByTag($tag_id, $options = []) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 't_page.date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			INNER JOIN
				{page_tag} t_page_tag
			ON
				t_page.id = t_page_tag.page_id
			WHERE
				t_page_tag.tag_id IN ($tag_id)
				AND t_page.date_publish <= NOW()
				AND t_page.is_enabled IS true
				AND t_page.is_category IS false
				AND is_static IS false
				{$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}
}
