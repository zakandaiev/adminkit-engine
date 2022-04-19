<?php

namespace Engine\Database;

use \PDO;
use \PDOException;
use \Exception;

use Engine\Config;

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
		$config = Config::get('database');

		if(empty($config)) {
			throw new Exception(sprintf('Database config file is empty or invalid', $path));
		}

		extract($config);

		$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $name, $charset);

		if(empty($username) || empty($name) || !isset($prefix)) {
			return null;
		}

		try {
			$connection = new PDO($dsn, $username, $password, $options);
		} catch(PDOException $error) {
			throw new Exception($error->getMessage());
		}

		return $connection ?? null;
	}
}
