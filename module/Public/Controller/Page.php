<?php

namespace Module\Public\Controller;

class Page extends Controller {
	public function getPage() {
		$page_url = 'home';
		$page_template = 'home';

		if(isset($this->route['parameters']['url'])) {
			if($this->route['parameters']['url'] === 'home') {
				$this->view->error('404');
				return true;
			}

			$page_url = $this->route['parameters']['url'];
		}

		$data['page'] = $this->model->getPage($page_url);

		if(empty($data['page'])) {
			$this->view->error('404');
		}

		if(!empty($data['page']->template)) {
			$page_template = $data['page']->template;
		}
		else if($data['page']->is_category) {
			$page_template = 'category';
		}
		else if(!$data['page']->is_static) {
			$page_template = 'post';
		}
		else if($page_url !== 'home') {
			$page_template = 'page';
		}

		$data['page']->categories = $this->model->getPageCategories($data['page']->id);
		$data['page']->comments = $this->model->getPageComments($data['page']->id);
		$data['page']->comments_count = $this->model->getPageCommentsCount($data['page']->id);
		$data['page']->tags = $this->model->getPageTags($data['page']->id);
		$data['page']->custom_fields = $this->model->getPageCustomFields($data['page']->id);

		$this->model->updateViewsCounter($data['page']->id);

		$this->view->setData($data);
		$this->view->render($page_template);

		return true;
	}

	public function getTag() {
		$tag_url = $this->route['parameters']['url'];

		$data['tag'] = $this->model->getTagByUrl($tag_url);

		if(empty($data['tag'])) {
			$this->view->error('404');
		}

		$this->view->setData($data);
		$this->view->render('tag');

		return true;
	}

	public function getAuthor() {
		$author_id = $this->route['parameters']['id'];

		$data['author'] = $this->model->getAuthor($author_id);

		if(empty($data['author'])) {
			$this->view->error('404');
		}

		$this->view->setData($data);
		$this->view->render('author');

		return true;
	}
}
