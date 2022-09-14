<?php

namespace Module\Admin\Controller;

use Engine\Theme\Breadcrumb;

class Group extends AdminController {
	public function getAll() {
		$groups = $this->model->getGroups();

		$data['groups'] = $groups;

		$this->page->title = __('Groups');
		Breadcrumb::set([__('Groups')]);

		$this->view->setData($data);
		$this->view->render('group/all');
	}

	public function getAdd() {
		$data['routes'] = $this->model->getRoutes();
		$data['users'] = $this->model->getUsers();

		$this->page->title = __('Add group');
		Breadcrumb::set([
			__('Groups') . '@/admin/group',
			__('Add')
		]);

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
		Breadcrumb::set([
			__('Groups') . '@/admin/group',
			__('Edit')
		]);

		$this->view->setData($data);
		$this->view->render('group/edit');
	}
}
