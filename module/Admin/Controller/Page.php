<?php

namespace Module\Admin\Controller;

use Engine\Server;
use Engine\Language;

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

		$is_translation = false;

		if(isset($this->route['parameters']['language'])) {
			$is_translation = true;

			$data['page_origin'] = $this->model->getPage($page_id);

			if(empty($data['page_origin'])) {
				$this->view->error('404');
			}
		}

		$data['page_edit'] = $this->model->getPage($page_id, $is_translation ? $this->route['parameters']['language'] : null);

		if(empty($data['page_edit'])) {
			$this->view->error('404');
		}

		$data['is_translation'] = $is_translation;

		$data['page_edit']->categories = $this->model->getPageCategories($page_id);
		$data['page_edit']->tags = $this->model->getPageTags($page_id, $is_translation ? $this->route['parameters']['language'] : null);
		$data['page_edit']->custom_fields = $this->model->getPageCustomFields($page_id, $is_translation ? $this->route['parameters']['language'] : null);

		$data['authors'] = $this->model->getAuthors();
		$data['categories'] = $this->model->getCategories($page_id);
		$data['tags'] = $this->model->getTags($is_translation ? $this->route['parameters']['language'] : null);

		$data['page_edit']->custom_fieldsets = $this->model->getPageCustomFieldSets($data['page_edit']);

		$this->view->setData($data);
		$this->view->render('page/edit');
	}

	public function getAddTranslation() {
		$page_id = $this->route['parameters']['id'];
		$translation_language = $this->route['parameters']['language'];

		if(!Language::has($translation_language)) {
			Server::redirect(site('url_language') . '/admin/page');
		}

		$page = $this->model->getPage($page_id);

		if(empty($page)) {
			Server::redirect(site('url_language') . '/admin/page');
		}

		$translation = [
			'page_id' => $page_id,
			'language' => $translation_language,
			'title' => $page->title,
			'content' => $page->content,
			'excerpt' => $page->excerpt,
			'image' => $page->image,
			'seo_description' => $page->seo_description,
			'seo_keywords' => $page->seo_keywords,
			'seo_image' => $page->seo_image
		];

		if($this->model->createTranslation($translation)) {
			Server::redirect(site('url_language') . '/admin/page/edit/' . $page_id . '/translation/edit/' . $translation_language);
		} else {
			Server::redirect(site('url_language') . '/admin/page');
		}
	}
}
