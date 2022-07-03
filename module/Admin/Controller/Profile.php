<?php

namespace Module\Admin\Controller;

class Profile extends AdminController {
	public function getProfile() {
		$data['user'] = $this->user;

		if(isset($this->route['parameters']['id'])) {
			$data['user'] = $this->model->getUserById($this->route['parameters']['id']);
		}

		if(empty($data['user'])) {
			$this->view->error('404');
		}

		$data['user']->notifications_full = $this->model->getUserNotificationsFull($data['user']->id);
		$data['user']->notifications_full_count = $this->model->getUserNotificationsFullCount($data['user']->id);

		$this->model->readNotifications($data['user']->id);

		$this->view->setData($data);
		$this->view->render('profile/profile');
	}

	public function getEdit() {
		$data['user'] = $this->user;

		$this->view->setData($data);
		$this->view->render('profile/edit');
	}

	public function postNotification() {
		$data['user'] = $this->user;

		if(isset($this->route['parameters']['id'])) {
			$data['user'] = $this->model->getUserById($this->route['parameters']['id']);
		}

		$data['notifications_full'] = $this->model->getUserNotificationsFull($data['user']->id);
		$data['notifications_full_count'] = $this->model->getUserNotificationsFullCount($data['user']->id);

		$this->view->setData($data);
		$this->view->render('profile/notification-load-more');
	}
}
