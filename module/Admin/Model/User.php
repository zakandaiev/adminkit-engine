<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class User {
	public function getUsers() {
		$sql = '
			SELECT
				*,
				(SELECT COUNT(*) FROM {user_group} WHERE user_id=t_user.id) as count_groups
			FROM
				{user} t_user
		';

		$users = new Statement($sql);

		$users = $users->filter('User', 'WHERE')->paginate()->execute()->fetchAll();

		return $users;
	}

	public function getUserById($id) {
		return \Engine\User::get($id);
	}

	public function getGroups() {
		$sql = 'SELECT id, name FROM {group} WHERE is_enabled IS true ORDER BY name ASC';

		$groups = new Statement($sql);

		return $groups->execute()->fetchAll();
	}

	public function getUserGroups($user_id) {
		$groups_array = [];

		$sql = 'SELECT group_id FROM {user_group} WHERE user_id = :user_id';

		$groups = new Statement($sql);

		foreach($groups->execute(['user_id' => $user_id])->fetchAll() as $category) {
			$groups_array[] = $category->group_id;
		}

		return $groups_array;
	}
}
