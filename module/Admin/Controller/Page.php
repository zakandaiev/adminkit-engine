<?php

namespace Module\Admin\Controller;

use Engine\Server;

class Page extends AdminController {
	public function getAll() {
		$pages = $this->model->getPages();

		$data['pages'] = $pages;

		$this->view->setData($data);
		$this->view->render('page/all');
	}

	public function getCategory() {
		$category_id = $this->route['parameters']['id'];

		$pages = $this->model->getPagesByCategory($category_id);

		$data['pages'] = $pages;

		if(empty($data['pages'])) {
			$this->view->error('404');
		}

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
		$page_origin = $page_id;

		$is_translation = false;
		if(isset($this->route['parameters']['translation_id'])) {
			$is_translation = true;
			$page_id = $this->route['parameters']['translation_id'];
		}

		$data['page_edit'] = $this->model->getPageById($page_id);

		if(empty($data['page_edit'])) {
			$this->view->error('404');
		}

		if($is_translation) {
			$data['page_origin'] = $this->model->getPageById($page_origin);

			if(empty($data['page_origin']) || $data['page_origin']->url !== $data['page_edit']->url) {
				$this->view->error('404');
			}
		}

		$data['page_edit']->is_translation = $is_translation;

		$data['page_edit']->categories = $this->model->getPageCategories($page_id);
		$data['page_edit']->tags = $this->model->getPageTags($page_id);
		$data['page_edit']->custom_fields = $this->model->getPageCustomFields($page_id);

		$data['authors'] = $this->model->getAuthors();
		$data['categories'] = $this->model->getCategories($page_id);
		$data['tags'] = $this->model->getTags();

		$this->view->setData($data);
		$this->view->render('page/edit');
	}

	public function getAddTranslation() {
		$page_id = $this->route['parameters']['id'];
		$translation_language = $this->route['parameters']['language'];

		if(!array_key_exists($translation_language, $this->module['languages'])) {
			Server::redirect(site('url_language') . '/admin/page');
		}

		$page = $this->model->getPageById($page_id);

		if(empty($page)) {
			Server::redirect(site('url_language') . '/admin/page');
		}

		$page = (array) $page;

		unset($page['id']);
		$page['language'] = $translation_language;

		$translation_id = $this->model->createPage($page);

		Server::redirect(site('url_language') . '/admin/page/edit/' . $page_id . '/translation/edit/' . $translation_id);
	}
}
