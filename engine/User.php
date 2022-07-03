<?php

namespace Engine;

use Engine\Database\Statement;

class User {
	private static $current;
	private static $demand = [];
	private static $all = [];

	public static function initialize() {
		self::$current = new \stdClass();
		self::$current->id = null;
		self::$current->authorized = false;

		if(Session::hasCookie(COOKIE_KEY['auth'])) {
			$auth_key = Session::getCookie(COOKIE_KEY['auth']);

			$sql = '
				SELECT
					*
				FROM
					{user}
				WHERE
					auth_token = :auth_token
					AND auth_ip = :auth_ip
					AND is_enabled IS true
				ORDER BY
					date_created DESC
				LIMIT 1
			';

			$user = new Statement($sql);

			$binding = [
				'auth_token' => $auth_key,
				'auth_ip' => Request::$ip
			];

			$user = $user->execute($binding)->fetch();

			if($user) {
				self::$current = self::format($user, true);
			}
		}

		return true;
	}

	public static function get($id = null) {
		if(isset($id) && isset(self::$demand[$id])) {
			return self::$demand[$id];
		} else if(isset($id)) {
			$sql = 'SELECT * FROM {user} WHERE id = :id ORDER BY date_created DESC LIMIT 1';

			$user = new Statement($sql);

			$user = $user->execute(['id' => $id])->fetch();

			if(!$user) {
				return $user;
			}

			$user = self::format($user);

			self::$demand[$user->id] = $user;

			return $user;
		}

		return self::$current;
	}

	public static function getAll($order = '') {
		if(!empty(self::$all)) {
			return self::$all;
		}

		if(!empty($order)) {
			$order = "ORDER BY $order";
		}

		$sql = "SELECT * FROM {user} $order";

		$users = new Statement($sql);

		$users = $users->execute()->fetchAll();

		foreach($users as $user) {
			self::$all[$user->id] = self::format($user);
		}

		return self::$all;
	}

	public static function authorize($user, $lifetime = null) {
		$auth_token = Hash::token();

		$user->ip = Request::$ip;

		$authorize = '
			UPDATE {user} SET
				auth_token = :auth_token,
				auth_ip = :auth_ip,
				auth_date = CURRENT_TIMESTAMP
			WHERE id = :user_id
		';

		$authorize = new Statement($authorize);

		$authorize->execute(['user_id' => $user->id, 'auth_ip' => $user->ip, 'auth_token' => $auth_token]);

		Session::setCookie(COOKIE_KEY['auth'], $auth_token, $lifetime ?? LIFETIME['auth']);

		self::$current = $user;
		self::$current->authorized = true;

		Notification::create('user_authorize', $user->id, ['ip' => $user->ip]);

		Log::write('User ID: ' . $user->id . ' logged in from IP: ' . $user->ip, 'user');

		Hook::run('user_authorize', $user);

		return true;
	}

	public static function unauthorize() {
		Session::unsetCookie(COOKIE_KEY['auth']);

		Log::write('User ID: ' . self::$current->id . ' logged out from IP: ' . Request::$ip, 'user');

		Hook::run('user_unauthorize', self::$current);

		self::$current = new \stdClass();
		self::$current->authorized = false;

		return true;
	}

	public static function register($user) {
		if(is_array($user)) {
			$user = json_decode(json_encode($user));
		}

		$user_password = $user->password;
		$user->password = Hash::password($user->password);

		$register = '
			INSERT INTO {user}
				(name, login, email, password)
			VALUES
				(:name, :login, :email, :password)
		';

		$register = new Statement($register);

		$user->id = $register->execute(json_decode(json_encode($user), true))->insertId();

		self::authorize($user);

		Notification::create('user_register', $user->id, ['ip' => $user->ip]);

		$user->password = $user_password;

		Mail::send('Register', $user->email, $user);

		Log::write('User ID: ' . $user->id . ' registered from IP: ' . $user->ip, 'user');

		Hook::run('user_register', $user);

		return true;
	}

	public static function restore($email) {
		$statement = new Statement('SELECT * FROM {user} WHERE email = :email LIMIT 1');

		$user = $statement->execute(['email' => $email])->fetch();

		if(empty($user)) {
			return false;
		}

		$new_password = Hash::token();

		$update_password = '
			UPDATE {user} SET
				password = :new_password
			WHERE id = :id
		';

		$update_password = new Statement($update_password);

		$update_password->execute(['id' => $user->id, 'new_password' => Hash::password($new_password)]);

		$user->password = $new_password;

		Notification::create('user_restore', $user->id, ['ip' => Request::$ip]);

		Mail::send('Restore', $email, $user);

		Log::write('User ID: ' . $user->id . ' restored password from IP: ' . Request::$ip, 'user');

		Hook::run('user_restore', $user);

		return true;
	}

	public static function format($user, $authorized = false) {
		if(!$user) {
			return $user;
		}

		$user->authorized = $authorized;
		$user->nicename = !empty($user->name) ? "{$user->name} (@$user->login)" : "@$user->login";
		$user->setting = isset($user->setting) ? (json_decode($user->setting) ?? new \stdClass()) : new \stdClass();
		$user->setting->notifications = $user->setting->notifications ?? new \stdClass();
		$user->socials = isset($user->socials) ? (json_decode($user->socials) ?? []) : [];

		return $user;
	}

	public static function update($key, $value = null, $id = null) {
		$id = $id ?? self::get()->id;

		$binding = [$key => $value, 'id' => $id];

		$sql = "UPDATE {user} SET $key = :$key WHERE id = :id";

		$statement = new Statement($sql);

		$statement->execute($binding);

		Log::write('User ID: ' . $id . ' updated ' . $key . ' from IP: ' . Request::$ip, 'user');

		Hook::run('user_update', $id);
		Hook::run('user_update_' . $key, $id);

		return true;
	}

	public static function delete($id) {
		$sql = "DELETE FROM {user} WHERE id = :id";

		$statement = new Statement($sql);

		$statement->execute(['id' => $id]);

		Log::write('User ID: ' . $id . ' deleted from IP: ' . Request::$ip, 'user');

		Hook::run('user_delete', $id);

		return true;
	}
}
