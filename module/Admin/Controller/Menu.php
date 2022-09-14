<?php

namespace Module\Admin\Controller;

use Engine\Theme\Breadcrumb;

class Menu extends AdminController {
	public function getAll() {
		$data['menus'] = \Engine\Theme\Menu::getAll();
		$data['is_edit'] = false;

		$this->page->title = __('Menu');
		Breadcrumb::set([__('Menu')]);

		$this->view->setData($data);
		$this->view->render('menu');
	}

	public function getEdit() {
		$menu_id = $this->route['parameters']['id'];

		$data['menu'] = \Engine\Theme\Menu::get($menu_id);

		if(!$data['menu']) {
			$this->view->error('404');
		}

		$data['menus'] = \Engine\Theme\Menu::getAll();
		$data['is_edit'] = true;
		$data['edit_id'] = intval($menu_id);

		$this->page->title = __('Edit menu');
		Breadcrumb::set([
			__('Menu') . '@/admin/menu',
			__('Edit')
		]);

		$this->view->setData($data);
		$this->view->render('menu');
	}
}
