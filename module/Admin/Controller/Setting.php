<?php

namespace Module\Admin\Controller;

use Engine\Form;
use Engine\Server;
use Engine\Theme\Breadcrumb;

class Setting extends AdminController {
	public function getSection() {
		$section = $this->route['parameters']['section'];

		$data['section'] = $section;
		$data['settings'] = $this->model->getSettings($section);

		if(empty($data['settings'])) {
			$this->view->error('404');
		}

		$this->page->title = __('Edit') . ' ' . __($section . ' settings');

		Breadcrumb::add(__('Settings'), '/admin/setting/' . $section);
		Breadcrumb::add(ucfirst($section));

		$this->view->setData($data);
		$this->view->render('setting/' . $section);
	}

	public function postSection() {
		$section = $this->route['parameters']['section'];
		$form_name = 'Setting/' . ucfirst($section);

		Form::check($form_name);

		$fields = Form::processFields($form_name);

		foreach($fields as $name => $value) {
			\Engine\Setting::update($section, $name, $value);
		}

		Server::answer(null, 'success', __('Settings saved'));
	}
}
