<?php

namespace Engine;

abstract class Controller {
	protected $module;
	protected $route;

	protected $view;
	protected $model;

	protected $setting;
	protected $language;

	protected $user;

	public function __construct() {		
		$this->module = Module::getAll()[Module::$name];
		$this->route = Router::$route;

		$this->view = new View();
		$this->model = $this->loadModel($this->route['controller']);

		$this->setting = Setting::getAll();

		Language::initialize();
		$this->language = Language::getAll();

		$this->user = Auth::$user;
	}

	private function loadModel($model_name) {
		$model_class = Path::class('model') . '\\' . ucfirst($model_name);

		if(class_exists($model_class)) {
			return new $model_class;
		}

		return null;
	}
}