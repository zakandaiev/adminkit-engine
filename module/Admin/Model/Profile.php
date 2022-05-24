<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;
use Engine\Notification;

class Profile {
	public function getUserById($id) {
		$sql = 'SELECT * FROM {user} WHERE id=:id';

		$user = new Statement($sql);

		$user = $user->execute(['id' => $id])->fetch();

		if(!empty($user->socials)) {
			$user->socials = json_decode($user->socials);
		}

		return $user;
	}

	public function getUserNotificationsCount($id) {
		$notifications = new Statement('SELECT count(*) FROM {notification} WHERE user_id=:user_id');

		return intval($notifications->execute(['user_id' => $id])->fetchColumn());
	}

	public function getUserNotifications($id) {
		$notifications = new Statement('SELECT * FROM {notification} WHERE user_id=:user_id ORDER BY is_read=true, date_created DESC');

		return $notifications->execute(['user_id' => $id])->fetchAll();
	}

	public function readNotifications($user_id) {
		return Notification::readAll($user_id);
	}
}
