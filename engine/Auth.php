<?php

namespace Engine;

use Engine\Database\Statement;

class Auth {
	const AUTH_KEY = 'auth_token';

	public static $user;

	public static function initialize() {
		self::$user = new \stdClass();
		self::$user->authorized = false;
		self::$user->groups = [];

		if(Session::hasCookie(self::AUTH_KEY)) {
			$auth_key = Session::getCookie(self::AUTH_KEY);

			$user = new Statement('SELECT * FROM {user} WHERE auth_token=:auth_token AND last_ip=:last_ip AND enabled IS true ORDER BY date_created DESC LIMIT 1');

			$user_binding = [
				'auth_token' => $auth_key,
				'last_ip' => filter_var($_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP)
			];

			$user = $user->prepare()->bind($user_binding)->execute()->fetch();

			if(!empty($user)) {
				self::$user = $user;
				self::$user->authorized = true;
			}
		}

		return true;
	}

	public static function authorize($user, $days = null) {
		$auth_token = Hash::token();

		$user->ip = filter_var($_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP);

		$authorize = '
			UPDATE {user} SET 
				auth_token=:auth_token,
				last_ip=:last_ip,
				last_auth=CURRENT_TIMESTAMP
			WHERE id=:user_id
		';

		$authorize = new Statement($authorize);
		
		$authorize->prepare()->bind(['user_id' => $user->id, 'last_ip' => $user->ip, 'auth_token' => $auth_token])->execute();

		Session::setCookie(self::AUTH_KEY, $auth_token, !empty($days) ? $days : Define::AUTH_DAYS);

		self::$user = $user;
		self::$user->authorized = true;

		Notification::create('authorize', $user->id, ['ip' => $user->ip]);

		return true;
	}

	public static function unauthorize() {
		Session::unsetCookie(self::AUTH_KEY);

		self::$user = new \stdClass();
		self::$user->authorized = false;

		return true;
	}

	public static function register($user) {
		$user_password = $user->password;
		$user->password = Hash::password($user->password);

		$register = '
			INSERT INTO {user}
				(name, login, email, password)
			VALUES 
				(:name, :login, :email, :password)
		';

		$register = new Statement($register);

		$user->id = $register->prepare()->bind(json_decode(json_encode($user), true))->execute()->insertId();

		self::authorize($user);

		Notification::create('register', $user->id, ['ip' => $user->ip]);

		$user->password = $user_password;
		Mail::send('Register', $user);

		return true;
	}
}
