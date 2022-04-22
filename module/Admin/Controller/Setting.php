<?php

namespace Module\Admin\Controller;

use Engine\Form;
use Engine\Server;

class Setting extends AdminController {
	public function getSection() {
		$section = $this->route['parameters']['section'];

		$data['section'] = $section;
		$data['settings'] = $this->model->getSettings($section);
		$data['themes'] = $this->model->getThemes();

		$this->view->setData($data);
		$this->view->render('setting/' . $section);
	}

	public function postSection() {
		$section = $this->route['parameters']['section'];
		$form_name = 'Setting/' . ucfirst($section);

		Form::check($form_name);

		$fields = Form::processFields($form_name);

		if(empty($fields)) {
			Server::answer(null, 'error', 'Form is missed or invalid');
		}

		foreach($fields as $name => $value) {
			\Engine\Setting::update($section, $name, $value);
		}

		Server::answer(null, 'success', 'success');
	}
}
