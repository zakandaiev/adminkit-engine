<?php

namespace Engine;

use Engine\Database\Statement;

class Notification {
	public static function create($type, $user_id, $info = null) {
		$user = User::get($user_id);

		if(!$user || @$user->setting->notifications->{'web_' . $type} === false) {
			return false;
		}

		$create = '
			INSERT INTO {notification}
				(user_id, type, info)
			VALUES
				(:user_id, :type, :info);
		';

		$create = new Statement($create);

		if(is_array($info) || is_object($info)) {
			$info = json_encode($info);
		}

		$binding = [
			'user_id' => $user_id,
			'type' => $type,
			'info' => $info
		];

		return $create->execute($binding)->insertId();
	}

	public static function read($id, $user_id) {
		$read_one = 'UPDATE {notification} SET is_read=true WHERE id = :id AND user_id = :user_id AND is_read IS false';

		$read_one = new Statement($read_one);

		$read_one->execute(['id' => $id, 'user_id' => $user_id]);

		return true;
	}

	public static function readAll($user_id) {
		$read_all = 'UPDATE {notification} SET is_read=true WHERE user_id = :user_id AND is_read IS false';

		$read_all = new Statement($read_all);

		$read_all->execute(['user_id' => $user_id]);

		return true;
	}
}
