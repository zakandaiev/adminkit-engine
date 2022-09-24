<?php

namespace Module\Admin\Controller;

use Engine\Module as ModuleEngine;
use Engine\Request;
use Engine\Server;

class Module extends AdminController {
	public function getAll() {
		$modules = ModuleEngine::list();

		$data['modules'] = $modules;

		$this->view->setData($data);
		$this->view->render('module/all');
	}

	public function getEdit() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getAll($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		$data['module'] = $module;

		$this->view->setData($data);
		$this->view->render('module/edit');
	}

	public function postEdit() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getAll($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		$priority = (!empty(Request::$post['priority']) || Request::$post['priority'] == '0') ? Request::$post['priority'] : null;
		$version = !empty(Request::$post['version']) ? Request::$post['version'] : null;
		$extends = !empty(Request::$post['extends']) ? Request::$post['extends'] : null;
		$description = !empty(Request::$post['description']) ? Request::$post['description'] : null;
		$is_enabled = @Request::$post['is_enabled'] === 'on' ? true : false;

		ModuleEngine::update('priority', $priority, $module['name']);
		ModuleEngine::update('version', $version, $module['name']);
		ModuleEngine::update('extends', $extends, $module['name']);
		ModuleEngine::update('description', $description, $module['name']);
		ModuleEngine::update('is_enabled', $is_enabled, $module['name']);

		Server::answer(null, 'success');
	}

	public function postDelete() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getAll($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		ModuleEngine::delete($module['name']);

		Server::answer(null, 'success');
	}

	public function postToggle() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getAll($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		ModuleEngine::update('is_enabled', !$module['is_enabled'], $module['name']);

		Server::answer(null, 'success');
	}
}
