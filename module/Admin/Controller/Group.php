<?php

namespace Module\Admin\Controller;

use Engine\Theme\Pagination;

class Group extends AdminController {
	public function getAll() {
		$pagination = new Pagination($this->model->countGroups());
		$groups = $this->model->getGroups($pagination);

		$data['pagination'] = $pagination;
		$data['groups'] = $groups;

		$this->page->title = __('Groups');

		$this->view->setData($data);
		$this->view->render('group/all');
	}

	public function getAdd() {
		$data['routes'] = $this->model->getRoutes();
		$data['users'] = $this->model->getUsers();

		$this->page->title = __('Add group');

		$this->view->setData($data);
		$this->view->render('group/add');
	}

	public function getEdit() {
		$group_id = $this->route['parameters']['id'];

		$data['group'] = $this->model->getGroupById($group_id);

		if(empty($data['group'])) {
			$this->view->error('404');
		}

		$data['routes'] = $this->model->getRoutes();
		$data['users'] = $this->model->getUsers();

		$data['group']->routes = $this->model->getGroupRoutesById($group_id);
		$data['group']->users = $this->model->getGroupUsersById($group_id);

		$this->page->title = __('Edit group');

		$this->view->setData($data);
		$this->view->render('group/edit');
	}
}
