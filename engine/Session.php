<?php

namespace Engine;

class Session {
	public static function initialize() {
		if(headers_sent()) {
			return false;
		}

		return session_start();
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

	public static function getAll() {
		return $_SESSION;
	}

	public static function setCookie($key, $value, $lifetime = null) {
		Request::$cookie[$key] = $value;

		return setcookie($key, $value, time() + intval($lifetime ?? LIFETIME['auth']), '/', '', false, true);
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

	public static function getCookieAll() {
		return Request::$cookie;
	}
}
