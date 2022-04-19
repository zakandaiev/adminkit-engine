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

			$user = new Statement('SELECT * FROM {user} WHERE ' . self::AUTH_KEY . '=:' . self::AUTH_KEY . ' AND enabled IS true ORDER BY date_created DESC LIMIT 1');

			$user = $user->prepare()->bind([self::AUTH_KEY => $auth_key])->execute()->fetch();

			if(!empty($user)) {
				self::$user = $user;
				self::$user->authorized = true;

				if(!empty($user->socials)) {
					self::$user->socials = json_decode($user->socials);
				}
			}
		}

		return true;
	}

	public static function authorize($user, $auth_hash, $days = null) {
		Session::setCookie(self::AUTH_KEY, $auth_hash, !empty($days) ? $days : Define::AUTH_DAYS);

		self::$user = $user;
		self::$user->authorized = true;

		return true;
	}

	public static function unauthorize() {
		Session::unsetCookie(self::AUTH_KEY);

		self::$user = new \stdClass();
		self::$user->authorized = false;

		return true;
	}
}
