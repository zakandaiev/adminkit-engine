<?php

namespace Module\Admin\Controller;

use Engine\Form;
use Engine\Path;
use Engine\Server;
use Engine\Module;
use Engine\Optimization;
use Engine\Theme\Asset;
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

		if($section === 'optimization') {
			if($fields['group_css'] === true && !site('group_css')) {
				$fields['group_css'] = $this->launchOptimization('css');
			} else if($fields['group_css'] === true && is_string(site('group_css'))) {
				$fields['group_css'] = site('group_css');
			}

			if($fields['group_js'] === true && !site('group_js')) {
				$fields['group_js'] = $this->launchOptimization('js');
			} else if($fields['group_js'] === true && is_string(site('group_js'))) {
				$fields['group_js'] = site('group_js');
			}
		}

		foreach($fields as $name => $value) {
			\Engine\Setting::update($section, $name, $value);
		}

		Server::answer(null, 'success', __('Settings saved'));
	}

	public function launchOptimization($type) {
		$functions = Path::file('theme') . '/functions.php';

		if(!file_exists($functions)) {
			return false;
		}

		Module::setName('Public');
		require_once $functions;

		$files = [];

		foreach(Asset::get($type) as $file) {
			$files[] = Path::file('asset') . '/' . $file['file'];
		}

		if(empty($files)) {
			return false;
		}

		$dest = Path::file('asset') . '/' . $type;

		return Optimization::{strtolower($type ?? '')}($files, $dest);
	}
}
