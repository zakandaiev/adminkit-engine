<?php

namespace Engine;

class Session {
	public static function initialize() {
		if(!headers_sent()) {
			session_start();
		}

		return true;
	}

	public static function get($key) {
		return $_SESSION[$key] ?? null;
	}

	public static function set($key, $data) {
		$_SESSION[$key] = $data;

		return true;
	}

	public static function has($key) {
		return isset($_SESSION[$key]);
	}

	public static function unset($key) {
		if(self::has($key)) {
			unset($_SESSION[$key]);
		}

		return true;
	}

	public static function flush() {
		$_SESSION = [];

		return true;
	}

	public static function setCookie($key, $value, $days = null) {
		if(empty($days)) $days = Define::AUTH_DAYS;
		setcookie($key, $value, time() + 3600 * 24 * intval($days), '/') ;
	}

	public static function getCookie($key) {
		return $_COOKIE[$key] ?? null;
	}

	public static function hasCookie($key) {
		return isset($_COOKIE[$key]);
	}

	public static function unsetCookie($key) {
		if(self::hasCookie($key)) {
			self::setCookie($key, '', 0, '/');
		}

		return true;
	}
}
