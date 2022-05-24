<?php

namespace Module\Admin\Model;

use Engine\Module;
use Engine\Database\Statement;

class Group {
	public function countGroups() {
		$sql = 'SELECT COUNT(*) FROM {group}';

		$count = new Statement($sql);

		return $count->execute()->fetchColumn();
	}

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

		$groups = $groups->paginate($this->countGroups())->execute()->fetchAll();

		return $groups;
	}

	public function getRoutes() {
		$routes_grouped = new \stdClass();

		foreach(Module::get('routes') as $route) {
			$routes_grouped->{$route['method']}[] = $route['uri'];
		}

		return $routes_grouped;
	}

	public function getUsers() {
		$sql = 'SELECT id, TRIM(CONCAT_WS("", name, " ", "(@", login, ")")) as name FROM {user} ORDER BY name ASC, login ASC';

		$users = new Statement($sql);

		return $users->execute()->fetchAll();
	}

	public function getGroupById($id) {
		$sql = 'SELECT * FROM {group} WHERE id=:id';

		$group = new Statement($sql);

		return $group->execute(['id' => $id])->fetch();
	}

	public function getGroupRoutesById($group_id) {
		$routes = new \stdClass();

		$sql = 'SELECT route FROM {group_route} WHERE group_id=:group_id';

		$statement = new Statement($sql);

		foreach($statement->execute(['group_id' => $group_id])->fetchAll() as $route) {
			list($method, $uri) = explode('@', $route->route, 2);
			$routes->{$method}[] = $uri;
		}

		return $routes;
	}

	public function getGroupUsersById($group_id) {
		$users = [];

		$sql = 'SELECT user_id FROM {user_group} WHERE group_id=:group_id';

		$statement = new Statement($sql);

		foreach($statement->execute(['group_id' => $group_id])->fetchAll() as $user) {
			$users[] = $user->user_id;
		}

		return $users;
	}
}
