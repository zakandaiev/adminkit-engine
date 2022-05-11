<?php

namespace Module\Admin\Controller;

use Engine\Theme\Pagination;

class Comment extends AdminController {
	public function getAll() {
		$pagination = new Pagination($this->model->countComments());

		$comments = $this->model->getComments($pagination);

		$data['pagination'] = $pagination;
		$data['comments'] = $comments;

		$this->page->title = __('Comments');

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

		$this->page->title = __('Edit comment');

		$this->view->setData($data);
		$this->view->render('comment/edit');
	}
}