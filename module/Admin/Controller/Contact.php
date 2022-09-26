<?php

namespace Module\Admin\Controller;

class Contact extends AdminController {
	public function getAll() {
		$contacts = $this->model->getContacts();

		$data['contacts'] = $contacts;

		$this->view->setData($data);
		$this->view->render('contact/all');
	}
}
