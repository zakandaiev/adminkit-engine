<?php

namespace Module\Admin\Controller;

use Engine\Hook;
use Engine\Language;
use Engine\Path;
use Engine\Request;
use Engine\Server;

class Translation extends AdminController {
	public function getAll() {
		$data['languages'] = Language::getAll();

		$this->view->setData($data);
		$this->view->render('translation/all');
	}

	public function getEdit() {
		$data['language'] = Language::get($this->route['parameters']['language']);

		if(empty($data['language'])) {
			$this->view->error('404');
		}

		$data['body'] = file_get_contents(Path::file('language') . '/' . $data['language']['file_name']);

		if(empty(trim($data['body'] ?? ''))) {
			$data['body'] = '; Silence is golden';
		}

		$this->view->setData($data);
		$this->view->render('translation/edit');
	}

	public function postEdit() {
		$data['language'] = Language::get($this->route['parameters']['language']);

		if(empty($data['language'])) {
			$this->view->error('404');
		}

		$data['body'] = file_get_contents(Path::file('language') . '/' . $data['language']['file_name']);

		if(Request::$post['body'] === $data['body']) {
			Server::answer(null, 'info');
		}

		try {
			file_put_contents(Path::file('language') . '/' . $data['language']['file_name'], Request::$post['body'], LOCK_EX);
		} catch(\Exception $error) {
			Server::answer(null, 'error', $error->getMessage());
		}

		Hook::run('admin_translation_edit', $data['language']);

		Server::answer(null, 'success', __('Translation saved'));
	}
}
