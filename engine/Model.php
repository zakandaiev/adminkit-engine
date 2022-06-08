<?php

namespace Engine;

abstract class Model {
	private static $instances = [];

	public function __construct() {
		self::$instances[get_called_class()] = $this;
	}

	public static function getInstance() {
		$class = get_called_class();

		if(!array_key_exists($class, self::$instances)) {
			self::$instances[$class] = new $class();
		}

		return self::$instances[$class];
	}
}
