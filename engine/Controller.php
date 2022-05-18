<?php

namespace Engine;

use Engine\Theme\Breadcrumb;

abstract class Controller {
	protected $module;
	protected $route;

	protected $view;
	protected $model;

	protected $setting;

	protected $user;

	protected $page;

	public function __construct() {
		$this->module = Module::getAll()[Module::$name];
		$this->route = Router::$route;

		$this->view = new View();
		$this->model = $this->loadModel($this->route['controller']);

		$this->setting = Setting::getAll();

		$this->user = Auth::$user;
		if(isset($this->user->socials)) {
			$this->user->socials = json_decode($this->user->socials) ?? [];
		}

		$this->page = new \stdClass();
		$this->page->title = $this->route['page']->title ?? __('Admin');
		$this->page->seo_description = $this->route['page']->seo_description ?? null;
		$this->page->seo_keywords = $this->route['page']->seo_keywords ?? null;
		$this->page->seo_image = $this->route['page']->seo_image ?? $this->setting->site->logo_public;
		$this->page->no_index_no_follow = $this->route['page']->no_index_no_follow ?? true;

		$this->view->setData(['page' => $this->page]);

		Breadcrumb::set($this->route['breadcrumbs']);
	}

	protected function loadModel($model_name) {
		$model_class = Path::class('model') . '\\' . ucfirst($model_name);

		if(class_exists($model_class)) {
			return new $model_class;
		}

		return null;
	}
}
