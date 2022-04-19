<?php

namespace Module\Admin\Controller;

use Engine\Theme\Pagination;

class Page extends Controller {
	public function getAll() {
		$pagination = new Pagination($this->model->countPages());
		$pages = $this->model->getPages($pagination);

		$data['pagination'] = $pagination;
		$data['pages'] = $pages;

		$this->view->setData($data);
		$this->view->render('page/all');
	}

	public function getAdd() {
		$data['authors'] = $this->model->getAuthors();
		$data['categories'] = $this->model->getCategories();
		$data['tags'] = $this->model->getTags();

		$this->view->setData($data);
		$this->view->render('page/add');
	}

	public function getEdit() {
		$page_id = $this->route['parameters']['id'];

		$data['page'] = $this->model->getPageById($page_id);

		if(!empty($data['page'])) {
			$data['page']->categories = $this->model->getPageCategories($page_id);
			$data['page']->tags = $this->model->getPageTags($page_id);
			$data['page']->custom_fields = $this->model->getPageCustomFields($page_id);

			$data['authors'] = $this->model->getAuthors();
			$data['categories'] = $this->model->getCategories($page_id);
			$data['tags'] = $this->model->getTags();
			
			$this->view->setData($data);
			$this->view->render('page/edit');
		} else {
			$this->view->error('404');
		}
	}

	public function getCategory() {
		$category_id = $this->route['parameters']['id'];

		$pagination = new Pagination($this->model->countPagesInCategory($category_id));
		$pages = $this->model->getPagesByCategory($category_id, $pagination);

		$data['pagination'] = $pagination;
		$data['pages'] = $pages;

		$this->view->setData($data);
		$this->view->render('page/all');
	}
}