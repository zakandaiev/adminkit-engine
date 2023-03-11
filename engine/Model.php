<?php

namespace Engine;

use Engine\Database\Statement;

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

	protected function executeStatementWithOptions($sql, $options = []) {
		foreach(['fields', 'where', 'order'] as $replacement_type) {
			$replacement = '$2';
			$replacement_pattern = '/\/' . $replacement_type . '(\+)?\/([\s\S]+)\/' . $replacement_type . '[\+]?\//miu';

			if(isset($options[$replacement_type])) {
				$replacement_match = preg_match($replacement_pattern, $sql, $replacement_matches);

				if($replacement_match && is_array($replacement_matches) && count($replacement_matches) > 1) {
					$replacement = ($replacement_matches[1] == '+') ? "{$replacement_matches[2]}, {$options[$replacement_type]}" : $options[$replacement_type];
				}
			}

			$sql = preg_replace($replacement_pattern, $replacement, $sql);
		}

		$options['limit'] = $options['limit'] ?? false;
		$options['offset'] = $options['offset'] ?? false;
		$options['filter'] = $options['filter'] ?? false;
		$options['paginate'] = $options['paginate'] ?? false;
		$options['debug'] = $options['debug'] ?? false;

		if($options['limit'] && !$options['paginate']) {
			$sql .= " LIMIT {$options['limit']}";
		}

		if($options['offset'] && !$options['paginate']) {
			$sql .= " OFFSET {$options['offset']}";
		}

		$statement = new Statement($sql, $options['debug']);

		if($options['filter']) {
			$statement->filter($options['filter']);
		}

		if($options['paginate']) {
			if($options['limit']) {
				$statement->paginate(null, ['limit' => $options['limit']]);
			} else {
				$statement->paginate();
			}
		}

		unset(
			$options['fields'],
			$options['where'],
			$options['order'],
			$options['limit'],
			$options['offset'],
			$options['filter'],
			$options['paginate'],
			$options['debug']
		);

		return $statement->execute($options);
	}
}
