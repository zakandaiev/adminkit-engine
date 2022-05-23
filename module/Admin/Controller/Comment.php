<?php

namespace Module\Admin\Controller;

class Comment extends AdminController {
	public function getAll() {
		$comments = $this->model->getComments();

		$data['comments'] = $comments;

		$this->view->setData($data);
		$this->view->render('comment/all');
	}

	public function getEdit() {
		$comment_id = $this->route['parameters']['id'];

		$data['comment'] = $this->model->getCommentById($comment_id);

		if(empty($data['comment'])) {
			$this->view->error('404');
		}

		$data['authors'] = $this->model->getAuthors();

		$this->view->setData($data);
		$this->view->render('comment/edit');
	}
}
