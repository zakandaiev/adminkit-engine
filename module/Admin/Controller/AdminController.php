<?php

namespace Module\Admin\Controller;

use Engine\Database\Statement;
use Engine\Server;

class AdminController extends \Engine\Controller {
	public function __construct() {
		parent::__construct();

		if(!$this->user->authorized) {
			Server::redirect('/admin/login');
		}

		$this->modelAdmin = $this->loadModel('AdminModel', 'Admin');

		// CHECK USER FOR ROUTE ACCESS
		$is_user_enabled = false;

		$this->user->access_all = $this->modelAdmin->getUserAccessAll($this->user->id);
		$this->user->groups = $this->modelAdmin->getUserGroups($this->user->id);
		$this->user->routes = $this->modelAdmin->getUserRoutes($this->user->id);

		if($this->route['is_public'] || $this->user->access_all) {
			$is_user_enabled = true;
		} else {
			foreach($this->user->routes as $route) {
				list($method, $uri) = explode('@', $route);

				if($this->route['method'] === $method && $this->route['uri'] === $uri) {
					$is_user_enabled = true;
					break;
				}
			}
		}

		if(!$is_user_enabled) {
			$this->view->error('404');
		}

		// GET USER NOTIFICATIONS
		$this->user->notifications_count = $this->modelAdmin->getUserNotificationsCount($this->user->id);
		$this->user->notifications = $this->modelAdmin->getUserNotifications($this->user->id);
	}
}
