<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class Comment {
	private static $instance;

	public static function getInstance() {
		if(!self::$instance instanceof self) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function countComments() {
		$sql = 'SELECT count(*) FROM {comment}';

		$count = new Statement($sql);

		return $count->execute()->fetchColumn();
	}

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
				t_page.title as page_title,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_comment.author) as author_name
			FROM
				{comment} t_comment
			LEFT JOIN
				{page} t_page
			ON
				t_page.id=t_comment.page_id
			ORDER BY
				t_comment.date_created DESC
		';

		$comments = new Statement($sql);

		$comments = $comments->paginate($this->countComments())->execute()->fetchAll();

		return $comments;
	}

	public function getCommentById($id) {
		$sql = '
			SELECT
				t_comment.*,
				t_page.url as page_url,
				t_page.title as page_title,
				(SELECT TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) FROM {user} WHERE id=t_comment.author) as author_name
			FROM
				{comment} t_comment
			LEFT JOIN
				{page} t_page
			ON
				t_page.id=t_comment.page_id
			WHERE t_comment.id=:id
		';

		$comment = new Statement($sql);

		return $comment->bind(['id' => $id])->execute()->fetch();
	}

	public function getAuthors() {
		$sql = 'SELECT * FROM {user} ORDER BY name ASC, login ASC';

		$authors = new Statement($sql);

		return $authors->execute()->fetchAll();
	}
}
