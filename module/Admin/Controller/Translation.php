<?php

namespace Module\Admin\Controller;

use Engine\Form;
use Engine\Hook;
use Engine\Language;
use Engine\Module;
use Engine\Path;
use Engine\Request;
use Engine\Server;

class Translation extends AdminController {
	public function getAll() {
		$languages = [];

		foreach($this->modules as $module) {
			$languages[$module['name']] = $module['languages'];
		}

		$data['languages'] = $languages;

		$this->view->setData($data);
		$this->view->render('translation/all');
	}

	public function getAdd() {
		$module = $this->route['parameters']['module'];

		if(!Module::has($module)) {
			$this->view->error('404');
		}

		$data['module'] = $module;

		$this->view->setData($data);
		$this->view->render('translation/add');
	}

	public function postAdd() {
		$module = $this->route['parameters']['module'];

		if(!Module::has($module)) {
			$this->view->error('404');
		}

		$form_name = 'Translation/Translation';

		Form::check($form_name);

		$fields = Form::processFields($form_name);

		if(Language::has($fields['key'], $module)) {
			Server::answer(null, 'error', __('This translation already exists'));
		}

		$translation_file = $fields['key'] . '@' . $fields['region'] . '@' . $fields['name'] . '.ini';
		$translation_content = '';

		$language_template = Path::class('controller', 'Dev') . '\\LanguageTemplate';

		if(class_exists($language_template) && method_exists($language_template, 'generate')) {
			$template = new $language_template;
			$translation_content = $template->generate($module);
		}

		$path_languages = Path::file('language', $module);
		if(!file_exists($path_languages)) {
			mkdir($path_languages, 0755, true);
		}

		$path_flags = Path::file('asset', $module) . '/img/flag';
		if(!file_exists($path_flags)) {
			mkdir($path_flags, 0755, true);
		}

		file_put_contents($path_languages . '/' . $translation_file, $translation_content);

		rename(ROOT_DIR . '/' . $fields['icon'], $path_flags . '/' . $fields['key'] . '.' . file_extension($fields['icon']));

		Hook::run('translation_add', [
			'module' => $module,
			'file' => $translation_file
		]);

		Server::answer(null, 'success', __('Translation added'));
	}

	public function getEdit() {
		$module = $this->route['parameters']['module'];
		$language = $this->route['parameters']['language'];

		if(!Module::has($module) || !Language::has($language, $module)) {
			$this->view->error('404');
		}

		$data['module'] = $module;
		$data['language'] = $language;

		$data['content'] = file_get_contents(Path::file('language', $module) . '/' . Language::list($module)[$language]['file_name']);

		if(empty(trim($data['content'] ?? ''))) {
			$data['content'] = '; Silence is golden';
		}

		$this->view->setData($data);
		$this->view->render('translation/edit');
	}

	public function postEdit() {
		$module = $this->route['parameters']['module'];
		$language = $this->route['parameters']['language'];

		if(!Module::has($module) || !Language::has($language, $module)) {
			$this->view->error('404');
		}

		$translation_file = Language::list($module)[$language]['file_name'];
		$translation_content = '';

		$path = Path::file('language', $module) . '/' . $translation_file;

		$translation_content = file_get_contents($path);

		if(Request::$post['content'] === $translation_content) {
			Server::answer(null, 'info');
		}

		try {
			file_put_contents($path, Request::$post['content'], LOCK_EX);
		} catch(\Exception $error) {
			Server::answer(null, 'error', $error->getMessage());
		}

		Hook::run('translation_edit', [
			'module' => $module,
			'file' => $translation_file
		]);

		Server::answer(null, 'success', __('Translation saved'));
	}
}
