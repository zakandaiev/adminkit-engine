<?php

namespace Engine;

abstract class Controller {
	protected $module;
	protected $route;

	protected $view;
	protected $model;

	protected $setting;

	protected $user;

	protected $page;

	public function __construct() {
		$this->module = Module::getAll();
		$this->route = Router::$route;

		$this->view = new View();
		$this->model = $this->loadModel($this->route['controller']);

		$this->setting = Setting::getAll();

		$this->user = User::get();

		$this->page = new \stdClass();
		$this->page->title = Engine::NAME;
		$this->page->seo_description = '';
		$this->page->seo_keywords = '';
		$this->page->seo_image = $this->setting->site->logo_public;
		$this->page->no_index_no_follow = false;

		$this->view->setData(['page' => $this->page]);
	}

	protected function loadModel($model_name, $module = null) {
		$model_class = Path::class('model', $module) . '\\' . ucfirst($model_name);

		if(class_exists($model_class)) {
			return new $model_class;
		}

		return null;
	}

	public function get404() {
		$this->view->error('404');

		return true;
	}
}
