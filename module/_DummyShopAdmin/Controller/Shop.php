<?php

namespace Module\_DummyShopAdmin\Controller;

use Engine\Theme\Breadcrumb;

use Module\Admin\Controller\AdminController;

class Shop extends AdminController {
	public function getProducts() {
		$data['products'] = [];

		$this->page->title = __('Products');
		Breadcrumb::set([
			__('Shop') . '@/admin/shop/setting',
			__('Products')
		]);

		$this->view->setData($data);
		$this->view->render('product');
	}
}
