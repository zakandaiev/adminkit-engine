<?php

namespace Engine\Database;

use Engine\Hash;
use Engine\Path;
use Engine\Request;

class Filter {
	public $sql;
	public $binding = [];
	public $order = [];

	private $name;
	private $filter = [];

	private static $instance;

	public static function getInstance() {
		if(!self::$instance instanceof self) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function __construct($name) {
		$this->name = strval($name);

		$this->load();
		$this->process();

		self::$instance = $this;
	}

	private function load() {
		$path = Path::file('filter') . '/' . $this->name . '.php';

		if(!is_file($path)) {
			return false;
		}

		$filter = include $path;

		if(!is_array($filter) || empty($filter)) {
			return false;
		}

		$this->filter = $filter;

		return true;
	}

	private function process() {
		if(empty($this->filter)) {
			return false;
		}

		$sql = [];
		$binding = [];
		$order = [];

		foreach($this->filter as $key => $type) {
			$filter_parts = explode('@', $key, 2);

			$request_key = $filter_parts[0];

			$filter_parts = explode('/', $filter_parts[1] ?? '');

			if(!Request::has($request_key) || empty($filter_parts)) {
				continue;
			}

			$value = trim(strval(Request::get($request_key)));
			$sql_part = [];

			foreach($filter_parts as $column_name) {
				$token = Hash::token(8);

				switch($type) {
					case 'boolean': {
						$sql_part[] = "$column_name = :$token";
						$binding[$token] = ($value === 'true' || $value === '1') ? true : false;

						break;
					}
					case 'date': {
						$parts = explode('@', $value, 2);

						$date_from = $parts[0];
						$date_to = $parts[1] ?? $parts[0];

						$key_from = $token;
						$key_to = Hash::token(8);

						$sql_part[] = "CAST($column_name AS DATE) BETWEEN CAST(:$key_from AS DATE) AND CAST(:$key_to AS DATE)";

						$binding[$key_from] = $date_from;
						$binding[$key_to] = $date_to;

						break;
					}
					case 'order': {
						$order[$column_name] = !empty($value) ? $value : 'asc';

						break;
					}
					case 'text': {
						$sql_part[] = "$column_name LIKE :$token";
						$binding[$token] = '%' . addcslashes($value, '%') . '%';

						break;
					}
					case '>':
					case '>=':
					case '<':
					case '<=':
					case '=': {
						$sql_part[] = "$column_name $type :$token";
						$binding[$token] = intval($value);

						break;
					}
					default: {
						$sql_part[] = "$column_name $type :$token";
						$binding[$token] = $value;

						break;
					}
				}
			}

			if(!empty($sql_part)) {
				$sql[] = '(' . implode(' OR ', $sql_part) . ')';
			}
		}

		$order_sql = [];
		foreach($order as $key => $value) {
			if(strtolower($value ?? '') === 'asc') {
				$order_sql[] = "$key ASC";
			}
			else if(strtolower($value ?? '') === 'desc') {
				$order_sql[] = "$key DESC";
			}
			else {
				$token = Hash::token(8);
				$binding[$token] = $value;
				$order_sql[] = "$key = :$token";
			}
		}

		$this->sql = implode(' AND ', $sql);
		$this->binding = $binding;
		$this->order = implode(', ', $order_sql);

		return true;
	}
}
