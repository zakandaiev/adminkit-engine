<?php

namespace Module\Admin\Controller;

class Profile extends AdminController {
	public function getProfile() {
		$data['user'] = clone $this->user;
		
		if(isset($this->route['parameters']['id'])) {
			$data['user'] = $this->model->getUserById($this->route['parameters']['id']);
		}

		if(!empty($data['user'])) {
			$data['user']->notifications_count = $this->model->getUserNotificationsCount($data['user']->id);
			$data['user']->notifications = $this->model->getUserNotifications($data['user']->id);

			$this->model->readNotifications($data['user']->id);
			
			$this->view->setData($data);
			$this->view->render('profile/profile');
		} else {
			$this->view->error('404');
		}
	}

	public function getEdit() {
		$data['user'] = $this->user;

		$this->view->setData($data);
		$this->view->render('profile/edit');
	}
}
