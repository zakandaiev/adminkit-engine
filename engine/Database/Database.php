<?php

namespace Engine\Database;

use \PDO;
use \PDOException;
use \Exception;

class Database {
	public static $connection;

	public static function initialize() {
		if(!self::$connection instanceof PDO) {
			self::$connection = self::connect();
		}

		return true;
	}

	public static function finalize() {
		self::$connection = null;

		return true;
	}

	private static function connect() {
		if(!defined('DATABASE')) {
			throw new Exception('Database config is missed');
		}

		if(empty(DATABASE)) {
			throw new Exception('Database config is empty');
		}

		extract(DATABASE);

		if(!isset($host) || !isset($name) || !isset($username) || !isset($password) || !isset($charset) || !isset($prefix) || !isset($options)) {
			throw new Exception('Database config is invalid');
		}

		$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $name, $charset);

		try {
			$connection = new PDO($dsn, $username, $password, $options);
		} catch(PDOException $error) {
			throw new Exception($error->getMessage());
		}

		return $connection ?? null;
	}
}
