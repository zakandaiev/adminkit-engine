<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;
use Engine\Module;
use Engine\User;

class Group {
	public function getGroups() {
		$sql = '
			SELECT
				*,
				(SELECT COUNT(*) FROM {group_route} WHERE group_id=t_group.id) as count_routes,
				(SELECT COUNT(*) FROM {user_group} WHERE group_id=t_group.id) as count_users
			FROM
				{group} t_group
		';

		$groups = new Statement($sql);

		$groups = $groups->filter('Group', 'WHERE')->paginate()->execute()->fetchAll();

		return $groups;
	}

	public function getRoutes() {
		$routes_grouped = [];
		$modules = Module::list();

		foreach($modules as $module) {
			if(!$module['is_enabled']) continue;
			foreach($module['routes'] as $route) {
				if(isset($route['is_public']) && $route['is_public'] === true) continue;
				$routes_grouped[$route['method']][] = $route['uri'];
			}
		}

		ksort($routes_grouped, SORT_NATURAL | SORT_FLAG_CASE);

		return array_map(function($a) {sort($a, SORT_NATURAL | SORT_FLAG_CASE);return $a;}, $routes_grouped);
	}

	public function getUsers() {
		return User::getAll('name ASC, login ASC');
	}

	public function getGroupById($id) {
		$sql = 'SELECT * FROM {group} WHERE id = :id';

		$group = new Statement($sql);

		return $group->execute(['id' => $id])->fetch();
	}

	public function getGroupRoutesById($group_id) {
		$routes = new \stdClass();

		$sql = 'SELECT route FROM {group_route} WHERE group_id = :group_id';

		$statement = new Statement($sql);

		foreach($statement->execute(['group_id' => $group_id])->fetchAll() as $route) {
			list($method, $uri) = explode('@', $route->route, 2);
			$routes->{$method}[] = $uri;
		}

		return $routes;
	}

	public function getGroupUsersById($group_id) {
		$users = [];

		$sql = 'SELECT user_id FROM {user_group} WHERE group_id = :group_id';

		$statement = new Statement($sql);

		foreach($statement->execute(['group_id' => $group_id])->fetchAll() as $user) {
			$users[] = $user->user_id;
		}

		return $users;
	}
}
