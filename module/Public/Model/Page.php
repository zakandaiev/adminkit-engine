<?php

namespace Module\Public\Model;

use Engine\Database\Statement;
use Engine\Setting;

class Page {
	private static $instance;

	public static function getInstance() {
		if(!self::$instance instanceof self) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function updateViewCounter($page_url) {
		$sql = 'UPDATE {page} SET views = views + 1 WHERE url=:page_url';

		$statement = new Statement($sql);

		$statement->bind(['page_url' => $page_url])->execute();

		return true;
	}

	public function getPageById($id) {
		$sql = '
			SELECT
				*,
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			WHERE
				id=:id AND date_publish <= NOW() AND is_enabled IS true
		';

		$page = new Statement($sql);

		return $page->bind(['id' => $id])->execute()->fetch();
	}

	public function getPageByUrl($url) {
		$sql = '
			SELECT
				*,
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			WHERE
				url=:url AND date_publish <= NOW() AND is_enabled IS true
		';

		$page = new Statement($sql);

		return $page->bind(['url' => $url])->execute()->fetch();
	}

	public function getPageCategories($page_id) {
		$sql = '
			SELECT
				t_page.title, t_page.url
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.category_id
			WHERE
				t_page_category.page_id=:page_id AND t_page.date_publish <= NOW() AND t_page.is_enabled IS true
		';

		$statement = new Statement($sql);

		return $statement->bind(['page_id' => $page_id])->execute()->fetchAll();
	}

	public function getPageTags($page_id) {
		$sql = '
			SELECT
				t_tag.name, t_tag.url
			FROM
				{page_tag} t_page_tag
			INNER JOIN
				{tag} t_tag
			ON
				t_tag.id = t_page_tag.tag_id
			WHERE
				t_page_tag.page_id=:page_id AND t_tag.is_enabled IS true
		';

		$statement = new Statement($sql);

		return $statement->bind(['page_id' => $page_id])->execute()->fetchAll();
	}

	public function getPageCommentsCount($page_id) {
		$sql = 'SELECT count(*) as count FROM {comment} WHERE page_id=:page_id';

		$count = new Statement($sql);

		return intval($count->bind(['page_id' => $page_id])->execute()->fetchColumn());
	}

	public function getPageComments($page_id) {
		$sql = 'SELECT
			t_comment.*, t_user.name as author_name, t_user.avatar as author_avatar
		FROM
			{comment} t_comment
		LEFT JOIN
			{user} t_user
		ON
			t_user.id=t_comment.author
		WHERE
			t_comment.page_id=:page_id AND t_comment.is_approved IS true
		';

		$statement = new Statement($sql);

		$comments = $statement->bind(['page_id' => $page_id])->execute()->fetchAll(\PDO::FETCH_ASSOC);

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

	public function getPageCustomFields($page_id) {
		$sql = 'SELECT name, value FROM {custom_field} WHERE page_id=:page_id';

		$custom_fields = new Statement($sql);

		$fields = new \stdClass();

		foreach($custom_fields->bind(['page_id' => $page_id])->execute()->fetchAll() as $field) {
			$fields->{$field->name} = $field->value;
		}

		return $fields;
	}

	public function getPages($options = []) {
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
			WHERE
				date_publish <= NOW() AND is_enabled IS true {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getPagesInCategory($category_id, $options = []) {
		$options = [
			'fields' => $options['fields'] ?? '*',
			'where' => isset($options['where']) ? 'AND ' . $options['where'] : '',
			'order' => isset($options['order']) ? $options['order'] : 't_page.date_publish DESC',
			'limit' => $options['limit'] ?? site('pagination_limit'),
			'offset' => isset($options['offset']) ? 'OFFSET ' . $options['offset'] : '',
		];

		$sql = "
			SELECT
				t_page.{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_category} t_page_category
			ON
				t_page.id = t_page_category.page_id
			WHERE
				t_page_category.category_id IN ($category_id) AND t_page.date_publish <= NOW() AND t_page.is_enabled IS true AND t_page.is_category IS false {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getPagePrevNext($page_id, $category_id = null) {
		// TODO: учитывать категорию
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
				FROM {page}
				WHERE date_publish <= NOW() AND is_enabled IS true AND is_category IS false AND is_static IS false
			) t
			WHERE id=:page_id
		';

		$pages = new Statement($sql);

		$pages = $pages->bind(['page_id' => $page_id])->execute()->fetch();

		$prev_next = new \stdClass();

		$prev_next->prev = @json_decode($pages->page_prev);
		$prev_next->next = @json_decode($pages->page_next);

		return $prev_next;
	}

	public function getAuthor($user_id) {
		$sql = 'SELECT id, name, address, avatar, about, socials FROM {user} WHERE id=:user_id';

		$author = new Statement($sql);

		return $author->bind(['user_id' => $user_id])->execute()->fetch();
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
				t_page.{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			WHERE
				t_page.author=:user_id AND t_page.date_publish <= NOW() AND t_page.is_enabled IS true AND t_page.is_category IS false AND t_page.is_static IS false {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->bind(['user_id' => $user_id])->execute()->fetchAll();
	}

	public function getRelatedPages($page, $options = []) {
		// TODO: select posts with similar tags and categories, esle: random
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
			WHERE
				date_publish <= NOW() AND is_enabled IS true AND is_category IS false {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getMVP($options = []) {
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
			WHERE
				date_publish <= NOW() AND is_enabled IS true AND is_category IS false AND is_static IS false {$options['where']}
			ORDER BY
				views DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getMCP($options = []) {
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
			WHERE
				date_publish <= NOW() AND is_enabled IS true AND is_category IS false AND is_static IS false {$options['where']}
			ORDER BY
				count_comments DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getCategories($options = []) {
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
			WHERE
				date_publish <= NOW() AND is_enabled IS true AND is_category IS true {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getTags($options = []) {
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
				(SELECT count(*) FROM {page_tag} WHERE tag_id=t_tag.id) as count_pages
			FROM
				{tag} t_tag
			WHERE
				is_enabled IS true {$options['where']}
			ORDER BY
				count_pages DESC {$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}

	public function getTagByUrl($url) {
		$sql = '
			SELECT
				*
			FROM
				{tag} t_tag
			WHERE
				url=:url AND is_enabled IS true
		';

		$page = new Statement($sql);

		return $page->bind(['url' => $url])->execute()->fetch();
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
				t_page.{$options['fields']},
				(SELECT name FROM {user} WHERE id=t_page.author) as author_name
			FROM
				{page} t_page
			INNER JOIN
				{page_tag} t_page_tag
			ON
				t_page.id = t_page_tag.page_id
			WHERE
				t_page_tag.tag_id IN ($tag_id) AND t_page.date_publish <= NOW() AND t_page.is_enabled IS true AND t_page.is_category IS false AND is_static IS false {$options['where']}
			ORDER BY
				{$options['order']}
			LIMIT {$options['limit']}
			{$options['offset']}
		";

		$pages = new Statement($sql);

		return $pages->execute()->fetchAll();
	}
}
