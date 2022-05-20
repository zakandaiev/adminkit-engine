<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class User {
	public function countUsers() {
		$sql = 'SELECT COUNT(*) FROM {user}';

		$count = new Statement($sql);

		return $count->prepare()->execute()->fetchColumn();
	}

	public function getUsers($pagination) {
		$sql = '
			SELECT
				*,
				(SELECT COUNT(*) FROM {user_group} WHERE user_id=t_user.id) as count_groups
			FROM
				{user} t_user
		';

		$users = new Statement($sql);

		$users = $users->paginate($pagination)->execute()->fetchAll();

		return $users;
	}

	public function getUserById($id) {
		$sql = 'SELECT * FROM {user} WHERE id=:id';

		$user = new Statement($sql);

		return $user->prepare()->bind(['id' => $id])->execute()->fetch();
	}

	public function getGroups() {
		$sql = 'SELECT id, name FROM {group} WHERE is_enabled IS true ORDER BY name ASC';

		$groups = new Statement($sql);

		return $groups->prepare()->execute()->fetchAll();
	}

	public function getUserGroupsById($user_id) {
		$groups_array = [];

		$sql = 'SELECT group_id FROM {user_group} WHERE user_id=:user_id';

		$groups = new Statement($sql);

		foreach($groups->prepare()->bind(['user_id' => $user_id])->execute()->fetchAll() as $category) {
			$groups_array[] = $category->group_id;
		}

		return $groups_array;
	}
}
