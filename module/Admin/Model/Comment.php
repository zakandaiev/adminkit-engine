<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class Comment extends \Engine\Model {
	public function countUnapprovedComments() {
		$sql = 'SELECT count(*) FROM {comment} WHERE is_approved IS false';

		$count = new Statement($sql);

		return $count->execute()->fetchColumn();
	}

	public function getComments() {
		$sql = '
			SELECT
				t_comment.*,
				t_page.url as page_url,
				t_page_translation.title as page_title,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_comment.author) as author_name
			FROM
				{comment} t_comment
			INNER JOIN
				{page} t_page
			ON
				t_page.id = t_comment.page_id
			INNER JOIN
				{page_translation} t_page_translation
			ON
				t_page.id = t_page_translation.page_id
			WHERE
				t_page_translation.language = :language
			ORDER BY
				t_comment.date_created DESC
		';

		$comments = new Statement($sql);

		$comments = $comments->filter('Comment')->paginate()->execute(['language' => site('language')])->fetchAll();

		return $comments;
	}

	public function getCommentById($id) {
		$sql = '
			SELECT
				t_comment.*,
				t_page.url as page_url,
				t_page_translation.title as page_title,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_comment.author) as author_name
			FROM
				{comment} t_comment
			LEFT JOIN
				{page} t_page
			ON
				t_page.id = t_comment.page_id
			LEFT JOIN
				{page_translation} t_page_translation
			ON
				t_page_translation.page_id = t_comment.page_id
			WHERE
				t_comment.id = :id
				AND t_page_translation.language = :language
		';

		$comment = new Statement($sql);

		return $comment->execute(['id' => $id, 'language' => site('language')])->fetch();
	}

	public function getAuthors() {
		$sql = 'SELECT * FROM {user} ORDER BY name ASC, login ASC';

		$authors = new Statement($sql);

		return $authors->execute()->fetchAll();
	}
}
