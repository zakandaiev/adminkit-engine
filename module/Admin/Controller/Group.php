<?php

namespace Module\Admin\Controller;

use Engine\Theme\Pagination;

class Group extends Controller {
	public function getAll() {
		$pagination = new Pagination($this->model->countGroups());
		$groups = $this->model->getGroups($pagination);

		$data['pagination'] = $pagination;
		$data['groups'] = $groups;

		$this->view->setData($data);
		$this->view->render('group/all');
	}

	public function getAdd() {
		$data['routes'] = $this->model->getRoutes();
		$data['users'] = $this->model->getUsers();

		$this->view->setData($data);
		$this->view->render('group/add');
	}

	public function getEdit() {
		$group_id = $this->route['parameters']['id'];

		$data['group'] = $this->model->getGroupById($group_id);

		if(!empty($data['group'])) {
			$data['routes'] = $this->model->getRoutes();
			$data['users'] = $this->model->getUsers();

			$data['group']->routes = $this->model->getGroupRoutesById($group_id);
			$data['group']->users = $this->model->getGroupUsersById($group_id);

			$this->view->setData($data);
			$this->view->render('group/edit');
		} else {
			$this->view->error('404');
		}
	}

	public function getCategory() {
		$category_id = $this->route['parameters']['id'];

		$pagination = new Pagination($this->model->countgroupsInCategory($category_id));
		$groups = $this->model->getgroupsByCategory($category_id, $pagination);

		$data['pagination'] = $pagination;
		$data['groups'] = $groups;

		$this->view->setData($data);
		$this->view->render('group/all');
	}
}