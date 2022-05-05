<?php

namespace Module\Admin\Controller;

use Engine\Request;
use Engine\Server;
use Engine\Theme\Pagination;

class Page extends AdminController {
	public function getAll() {
		$pagination = new Pagination($this->model->countPages());
		$pages = $this->model->getPages($pagination);

		$data['pagination'] = $pagination;
		$data['pages'] = $pages;

		$this->page->title = __('Pages');

		$this->view->setData($data);
		$this->view->render('page/all');
	}

	public function getCategory() {
		$category_id = $this->route['parameters']['id'];

		$pagination = new Pagination($this->model->countPagesInCategory($category_id));
		$pages = $this->model->getPagesByCategory($category_id, $pagination);

		$data['pagination'] = $pagination;
		$data['pages'] = $pages;

		$this->page->title = __('Pages');

		$this->view->setData($data);
		$this->view->render('page/all');
	}

	public function getAdd() {
		$data['authors'] = $this->model->getAuthors();
		$data['categories'] = $this->model->getCategories();
		$data['tags'] = $this->model->getTags();

		$this->page->title = __('Add page');

		$this->view->setData($data);
		$this->view->render('page/add');
	}

	public function getEdit() {
		$page_id = $this->route['parameters']['id'];

		$data['page_edit'] = $this->model->getPageById($page_id);

		if(empty($data['page_edit'])) {
			$this->view->error('404');
		}

		$data['page_edit']->categories = $this->model->getPageCategories($page_id);
		$data['page_edit']->tags = $this->model->getPageTags($page_id);
		$data['page_edit']->custom_fields = $this->model->getPageCustomFields($page_id);

		$data['authors'] = $this->model->getAuthors();
		$data['categories'] = $this->model->getCategories($page_id);
		$data['tags'] = $this->model->getTags();

		$this->page->title = __('Edit page');
		
		$this->view->setData($data);
		$this->view->render('page/edit');
	}

	public function getAddTranslation() {
		$page_id = $this->route['parameters']['id'];
		$page_language = Request::get('language');

		if(!array_key_exists($page_language, $this->module['languages'])) {
			Server::redirect(Request::$base . '/admin/page');
		}

		$page = $this->model->getPageById($page_id);

		if(empty($page)) {
			Server::redirect(Request::$base . '/admin/page');
		}

		$page = (array) $page;

		unset($page['id']);
		$page['language'] = $page_language;

		$translation_id = $this->model->createPage($page);

		Server::redirect(Request::$base . '/admin/page/edit/' . $translation_id . '?translation=' . $page_id . '&title=' . $page['title']);
	}
}
