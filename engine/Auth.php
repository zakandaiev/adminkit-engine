<?php

namespace Engine;

use Engine\Database\Statement;

class Auth {
	public static $user;

	public static function initialize() {
		self::$user = new \stdClass();
		self::$user->authorized = false;
		self::$user->groups = [];

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

			$user_binding = [
				'auth_token' => $auth_key,
				'auth_ip' => Request::$ip
			];

			$user = $user->execute($user_binding)->fetch();

			if(!empty($user)) {
				self::$user = $user;
				self::$user->authorized = true;
			}
		}

		return true;
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

		self::$user = $user;
		self::$user->authorized = true;

		Notification::create('login', $user->id, ['ip' => $user->ip]);

		Log::write('User ID: ' . $user->id . ' logged in from IP: ' . $user->ip, 'user');

		Hook::run('user_authorize', $user);

		return true;
	}

	public static function unauthorize() {
		Session::unsetCookie(COOKIE_KEY['auth']);

		Log::write('User ID: ' . self::$user->id . ' logged out from IP: ' . Request::$ip, 'user');

		Hook::run('user_unauthorize', self::$user);

		self::$user = new \stdClass();
		self::$user->authorized = false;

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

		Notification::create('register', $user->id, ['ip' => $user->ip]);

		$user->password = $user_password;

		Mail::send('Register', $user);

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

		$new_password = Hash::generatePassword();

		$update_password = '
			UPDATE {user} SET
				password = :new_password
			WHERE id = :id
		';

		$update_password = new Statement($update_password);

		$update_password->execute(['id' => $user->id, 'new_password' => Hash::password($new_password)]);

		$user->password = $new_password;

		Notification::create('restore', $user->id, ['ip' => Request::$ip]);

		Mail::send('Restore', $user);

		Log::write('User ID: ' . $user->id . ' restored password from IP: ' . Request::$ip, 'user');

		Hook::run('user_restore', $user);

		return true;
	}
}
