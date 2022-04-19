<?php

namespace Module\Admin\Controller;

use Engine\Server;
use Engine\Database\Statement;

class Controller extends \Engine\Controller {
	public function __construct() {
		parent::__construct();

		if(!$this->user->authorized) {
			Server::redirect('/admin/login');
		}

		$this->user->access_all = false;
		$this->user->groups = [];
		$this->user->enabled_routes = [];

		// ACCESS ALL
		$user_access_all_sql = '
			SELECT
				t_group.access_all
			FROM
				{user_group} t_user_group
			INNER JOIN
				{group} t_group
			ON
				t_group.id = t_user_group.group_id
			WHERE
				t_user_group.user_id=:user_id AND t_group.enabled IS true AND t_group.access_all IS true
			LIMIT 1
		';

		$user_access_all_statement = new Statement($user_access_all_sql);
		$user_access_all_result = $user_access_all_statement->prepare()->bind(['user_id' => $this->user->id])->execute()->fetch();

		if(isset($user_access_all_result) && !empty($user_access_all_result) && $user_access_all_result->access_all) {
			$this->user->access_all = true;
		}

		// GROUPS
		$user_groups = [];
		$groups = new Statement('SELECT * FROM {user_group} WHERE user_id=:user_id');
		$groups = $groups->prepare()->bind(['user_id' => $this->user->id])->execute()->fetchAll();

		if(!empty($groups)) {
			foreach($groups as $group) {
				$user_groups[] = $group->group_id;
			}
		}

		$this->user->groups = $user_groups;

		// ENABLED ROUTES
		$user_enabled_routes_sql = '
			SELECT
				t_group_route.route
			FROM
				{user_group} t_user_group
			INNER JOIN
				{group_route} t_group_route
			ON
				t_group_route.group_id = t_user_group.group_id
			INNER JOIN
				{group} t_group
			ON
				t_group.id = t_user_group.group_id
			WHERE
				t_user_group.user_id=:user_id AND t_group.enabled IS true
		';

		$user_enabled_routes_statement = new Statement($user_enabled_routes_sql);

		foreach($user_enabled_routes_statement->prepare()->bind(['user_id' => $this->user->id])->execute()->fetchAll() as $route) {
			$this->user->enabled_routes[] = $route->route;
		}
		
		// CHECK USER FOR ROUTE ACCESS
		$is_user_enabled = false;
		if($this->route['is_public'] || $this->user->access_all) {
			$is_user_enabled = true;
		} else {
			foreach($this->user->enabled_routes as $route) {
				list($method, $uri) = explode('@', $route);

				if($this->route['method'] === $method && $this->route['uri'] === $uri) {
					$is_user_enabled = true;
					break;
				}
			}
		}

		if(!$is_user_enabled) {
			$this->view->error('404');
			exit;
		}
	}
}