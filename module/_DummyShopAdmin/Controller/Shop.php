<?php

namespace Module\_DummyShopAdmin\Controller;

use Module\Admin\Controller\AdminController;

class Shop extends AdminController {
	public function getProducts() {
		$data['products'] = [];

		$this->view->setData($data);
		$this->view->render('product');
	}
}
