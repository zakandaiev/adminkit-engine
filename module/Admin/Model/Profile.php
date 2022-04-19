<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class Profile {
	public function getUserById($id) {
		$sql = 'SELECT * FROM {user} WHERE id=:id';

		$user = new Statement($sql);

		$user = $user->prepare()->bind(['id' => $id])->execute()->fetch();

		if(!empty($user->socials)) {
			self::$user->socials = json_decode($user->socials);
		}

		return $user;
	}
}