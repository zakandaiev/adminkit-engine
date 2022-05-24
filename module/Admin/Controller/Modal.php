<?php

namespace Module\Admin\Controller;

class Modal extends AdminController {
	public function get() {
		$modal_name = $this->route['parameters']['name'];

		$data['is_edit'] = false;

		$this->view->setData($data);
		$this->view->render('Modal/' . $modal_name, false);
	}
}
