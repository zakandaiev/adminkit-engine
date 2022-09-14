<?php

namespace Module\Admin\Controller;

use Engine\Theme\Breadcrumb;

class User extends AdminController {
	public function getAll() {
		$users = $this->model->getUsers();

		$data['users'] = $users;

		$this->page->title = __('Users');
		Breadcrumb::set([__('Users')]);

		$this->view->setData($data);
		$this->view->render('user/all');
	}

	public function getAdd() {
		$data['groups'] = $this->model->getGroups();

		$this->page->title = __('Add user');
		Breadcrumb::set([
			__('Users') . '@/admin/user',
			__('Add')
		]);

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
		$data['user']->groups = $this->model->getUserGroups($user_id);

		$this->page->title = __('Edit user');
		Breadcrumb::set([
			__('Users') . '@/admin/user',
			__('Edit')
		]);

		$this->view->setData($data);
		$this->view->render('user/edit');
	}
}
