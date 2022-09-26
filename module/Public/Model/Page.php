<?php

namespace Module\Public\Model;

use Engine\Database\Statement;

class Page extends \Engine\Model {
	public function updateViewsCounter($page_id) {
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
						(SELECT count(*) FROM {page_translation} pt INNER JOIN {page} p ON p.id = pt.page_id WHERE {$binding_key} = :{$binding_key} AND language = :language) > 0
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
				t_tag.*
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
		$sql = "
			SELECT
				count(*)
			FROM
				{comment}
			WHERE
				page_id = :page_id
				AND
					(CASE WHEN
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'moderate_comments') = 'true'
					THEN
						is_approved IS true
					ELSE
						1 = 1
					END)
		";

		$count = new Statement($sql);

		return $count->execute(['page_id' => $page_id])->fetchColumn();
	}

	public function getPageComments($page_id) {
		$sql = "
			SELECT
				t_comment.*,
				t_user.name as author_name,
				t_user.avatar as author_avatar
			FROM
				{comment} t_comment
			LEFT JOIN
				{user} t_user
			ON
				t_user.id = t_comment.author
			WHERE
				t_comment.page_id = :page_id
				AND
					(CASE WHEN
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'moderate_comments') = 'true'
					THEN
						t_comment.is_approved IS true
					ELSE
						1 = 1
					END)
		";

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

	public function getPagePrevNext($page_id, $language = null) {
		$sql_prev = '
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
				id <> :page_id
				AND date_publish <= (SELECT date_publish FROM {page} WHERE id = :page_id)
				AND id IN (SELECT page_id FROM {page_category} WHERE category_id IN (SELECT category_id FROM {page_category} WHERE page_id = :page_id))
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} pt INNER JOIN {page} p ON p.id = pt.page_id WHERE page_id = :page_id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = \'main\' AND name = \'language\')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS false
				AND is_static IS false
			ORDER BY
				date_publish DESC
			LIMIT 1
		';

		$sql_next = '
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
				id <> :page_id
				AND date_publish >= (SELECT date_publish FROM {page} WHERE id = :page_id)
				AND id IN (SELECT page_id FROM {page_category} WHERE category_id IN (SELECT category_id FROM {page_category} WHERE page_id = :page_id))
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} pt INNER JOIN {page} p ON p.id = pt.page_id WHERE page_id = :page_id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = \'main\' AND name = \'language\')
					END)
				AND date_publish <= NOW()
				AND is_enabled IS true
				AND is_category IS false
				AND is_static IS false
			ORDER BY
				date_publish ASC
			LIMIT 1
		';

		$prev = new Statement($sql_prev);
		$prev = $prev->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetch();

		$next = new Statement($sql_next);
		$next = $next->execute(['page_id' => $page_id, 'language' => $language ?? site('language_current')])->fetch();

		$prev_next = new \stdClass();

		$prev_next->prev = $prev;
		$prev_next->next = $next;

		return $prev_next;
	}

	public function getAuthor($user_id) {
		$sql = 'SELECT id, name, address, avatar, about, socials FROM {user} WHERE id = :user_id';

		$author = new Statement($sql);

		return $author->execute(['user_id' => $user_id])->fetch();
	}

	public function getLastComments($options = []) {
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 'date_created DESC';
		$options['language'] = $options['language'] ?? site('language_current');

		$sql = "
			SELECT
				author,
				date_created,
				(SELECT coalesce(name,login) FROM {user} WHERE id = t_comment.author) as author_name,
				(SELECT title FROM {page_translation} WHERE page_id = t_comment.page_id AND language = :language) as post_title,
				(SELECT url FROM {page} WHERE id = t_comment.page_id) as post_url
			FROM
				{comment} t_comment
			WHERE
				is_approved IS true
				{$options['where']}
			ORDER BY
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getPages($options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 't_page.date_publish DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getPagesByCategory($category_id, $options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 't_page.date_publish DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getPagesByAuthor($author_id, $options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 't_page.date_publish DESC';
		$options['language'] = $options['language'] ?? site('language_current');
		$options['author_id'] = $author_id;

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT name FROM {user} WHERE id = t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page.author = :author_id
				AND t_page.date_publish <= NOW()
				AND t_page.is_enabled IS true
				AND t_page.is_category IS false
				AND t_page.is_static IS false
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				{$options['where']}
			ORDER BY
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getRelatedPages($page, $options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 't_page.date_publish DESC';
		$options['language'] = $options['language'] ?? site('language_current');
		$options['page_id'] = $page->id;

		$page_tags = [];

		foreach($page->tags as $tag) {
			$page_tags[] = $tag->id;
		}

		if(!empty($page_tags)) {
			$options['where'] .= ' AND id IN (SELECT page_id FROM {page_tag} WHERE tag_id IN (' . implode(',', $page_tags) . ') AND page_id <> :page_id)';
		} else {
			$page_categories = [];

			foreach($page->categories as $category) {
				$page_categories[] = $category->id;
			}

			if(!empty($page_categories)) {
				$options['where'] .= ' AND id IN (SELECT page_id FROM {page_category} WHERE category_id IN (' . implode(',', $page_categories) . ') AND page_id <> :page_id)';
			}
		}

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
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getMVP($options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 'views DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getMCP($options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 'count_comments DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getCategories($options = []) {
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 'count_pages DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
		";

		return $this->getPreparedRows($sql, $options);
	}

	public function getTags($options = []) {
		$options['fields'] = $options['fields'] ?? 't_tag.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 'count_pages DESC';
		$options['language'] = $options['language'] ?? site('language_current');

		$sql = "
			SELECT
				{$options['fields']},
				(SELECT count(*) FROM {page_tag} WHERE tag_id = t_tag.id) as count_pages
			FROM
				{tag} t_tag
			WHERE
				language = :language
				AND is_enabled IS true
				{$options['where']}
			ORDER BY
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
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
		$options['fields'] = $options['fields'] ?? 't_page.*, t_page_translation.*';
		$options['where'] = isset($options['where']) ? 'AND ' . $options['where'] : '';
		$options['order'] = $options['order'] ?? 't_page.date_publish DESC';
		$options['language'] = $options['language'] ?? site('language_current');

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
				AND t_page_translation.language =
					(CASE WHEN
						(SELECT count(*) FROM {page_translation} WHERE page_id = t_page.id AND language = :language) > 0
					THEN
						:language
					ELSE
						(SELECT value FROM {setting} WHERE section = 'main' AND name = 'language')
					END)
				{$options['where']}
			ORDER BY
				{$options['order']}
		";

		return $this->getPreparedRows($sql, $options);
	}

	private function getPreparedRows($sql, $options = []) {
		$options['limit'] = $options['limit'] ?? false;
		$options['offset'] = $options['offset'] ?? false;
		$options['filter'] = $options['filter'] ?? false;
		$options['paginate'] = $options['paginate'] ?? false;
		$options['debug'] = $options['debug'] ?? false;

		if($options['limit']) {
			$sql .= " LIMIT {$options['limit']}";
		}

		if($options['offset']) {
			$sql .= " OFFSET {$options['offset']}";
		}

		$pages = new Statement($sql);

		if($options['filter']) {
			$pages->filter($options['filter']);
		}

		if($options['paginate']) {
			$pages->paginate();
		}

		unset(
			$options['limit'],
			$options['offset'],
			$options['filter'],
			$options['paginate'],
			$options['fields'],
			$options['where'],
			$options['order']
		);

		if($options['debug']) {
			unset($options['debug']);
			debug($options);
			debug($sql);
			return [];
		} else {
			unset($options['debug']);
		}

		return $pages->execute($options)->fetchAll();
	}
}
