<?php

namespace Module\Admin\Controller;

class Profile extends Controller {
	public function getProfile() {
		$data['user'] = $this->user;
		
		if(isset($this->route['parameters']['id'])) {
			$data['user'] = $this->model->getUserById($this->route['parameters']['id']);
		}

		if(!empty($data['user'])) {
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