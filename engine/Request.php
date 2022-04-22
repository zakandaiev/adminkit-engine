<?php

namespace Engine;

class Request {
	public static $method;
	public static $protocol;
	public static $host;
	public static $base;
	public static $uri;
	public static $url;
	public static $referer;

	public static $get = [];
	public static $post = [];
	public static $request = [];
	public static $cookie = [];
	public static $files = [];
	public static $server = [];

	public static $csrf;

	public static function initialize() {
		self::$method 	= strtolower($_SERVER['REQUEST_METHOD'] ?? 'get');
		self::$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');
		self::$host 		= $_SERVER['HTTP_HOST'];
		self::$base 		= self::$protocol . '://' . self::$host;
		self::$uri 			= $_SERVER['REQUEST_URI'];
		self::$url 			= self::$base . self::$uri;
		self::$referer 	= $_SERVER['HTTP_REFERER'] ?? null;

		self::$get			= $_GET;
		self::$post			= $_POST;
		self::$request	= $_REQUEST;
		self::$cookie		= $_COOKIE;
		self::$files		= $_FILES;
		self::$server		= $_SERVER;

		self::$csrf = self::setCSRF();

		if(self::$method !== 'get' && !self::verifyCSRF()) {
			Server::answer(null, 'error', 'Bad Request', 400);
		}

		return true;
	}

	public static function has($key) {
		return isset(self::$get[$key]) ? true : false;
	}

	public static function get($key) {
		return self::$get[$key] ?? null;
	}

	public static function setCSRF() {
		$token_key = Define::CSRF_KEY;
		$token = Session::get($token_key) ?? '';

		if(empty($token)) {
			$token = Hash::token();
			Session::set($token_key, $token);
		}

		return $token;
	}

	public static function verifyCSRF() {
		$token_key = Define::CSRF_KEY;
		$token_post = self::$post[$token_key] ?? '';
		$token_session = Session::get($token_key) ?? '';

		if(hash_equals($token_post, $token_session)) {
			return true;
		}

		return false;
	}
}
