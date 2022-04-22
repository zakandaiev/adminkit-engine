<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;
use Engine\Notification;

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

	public function getUserNotificationsCount($id) {
		$notifications = new Statement('SELECT count(*) FROM {notification} WHERE user_id=:user_id');

		return intval($notifications->prepare()->bind(['user_id' => $id])->execute()->fetchColumn());
	}

	public function getUserNotifications($id) {
		$notifications = new Statement('SELECT * FROM {notification} WHERE user_id=:user_id ORDER BY is_read=true, date_created DESC');

		return $notifications->prepare()->bind(['user_id' => $id])->execute()->fetchAll();
	}

	public function readNotifications($user_id) {
		return Notification::readAll($user_id);
	}
}
