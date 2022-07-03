<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;
use Engine\Notification;
use Engine\User;

class Profile {
	public function getUserById($id) {
		return User::get($id);
	}

	public function getUserNotificationsFullCount($id) {
		$notifications = new Statement('SELECT count(*) FROM {notification} WHERE user_id = :user_id');

		return $notifications->execute(['user_id' => $id])->fetchColumn();
	}

	public function getUserNotificationsFull($id) {
		$notifications = new Statement('SELECT * FROM {notification} WHERE user_id = :user_id ORDER BY is_read = true, date_created DESC');

		$notifications = $notifications->paginate($this->getUserNotificationsFullCount($id))->execute(['user_id' => $id])->fetchAll();

		foreach($notifications as $notification) {
			$notification->info = json_decode($notification->info);
		}

		return $notifications;
	}

	public function readNotifications($user_id) {
		return Notification::readAll($user_id);
	}
}
