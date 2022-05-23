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

	public static function setCookie($key, $value, $lifetime = null) {
		setcookie($key, $value, time() + intval($lifetime ?? Define::LIFETIME['auth']), '/', httponly:true);

		Request::$cookie[$key] = $value;

		return true;
	}

	public static function getCookie($key) {
		return Request::$cookie[$key] ?? null;
	}

	public static function hasCookie($key) {
		return isset(Request::$cookie[$key]);
	}

	public static function unsetCookie($key) {
		if(self::hasCookie($key)) {
			self::setCookie($key, '', 0, '/');
		}

		return true;
	}
}
