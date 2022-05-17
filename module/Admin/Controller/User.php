<?php

namespace Module\Admin\Controller;

use Engine\Theme\Pagination;

class User extends AdminController {
	public function getAll() {
		$pagination = new Pagination($this->model->countUsers());
		$users = $this->model->getUsers($pagination);

		$data['pagination'] = $pagination;
		$data['users'] = $users;

		$this->view->setData($data);
		$this->view->render('user/all');
	}

	public function getAdd() {
		$data['groups'] = $this->model->getGroups();

		$this->view->setData($data);
		$this->view->render('user/add');
	}

	public function getEdit() {
		$user_id = $this->route['parameters']['id'];

		$data['user'] = $this->model->getUserById($user_id);

		if(empty($data['user'])) {
			$this->view->error('404');
		}

		$data['groups'] = $this->model->getGroups();
		$data['user']->groups = $this->model->getUserGroupsById($user_id);

		$this->view->setData($data);
		$this->view->render('user/edit');
	}
}
