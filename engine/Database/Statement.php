<?php

namespace Engine\Database;

use \PDO;
use \PDOException;

use Engine\Cache;
use Engine\Module;
use Engine\Request;
use Engine\Server;
use Engine\Setting;
use Engine\Theme\Pagination;

class Statement {
	private $sql;
	private $debug;
	private $prefix;
	private $statement;
	private $binding = [];
	private $is_paginating = false;
	private $pagination = [];

	public function __construct($sql, $debug = false) {
		$this->debug = $debug;

		$this->prefix = DATABASE['prefix'];

		$replacement = '$1';
		if(!empty($this->prefix)) {
			$replacement = $this->prefix.'_$1';
		}

		$this->sql = preg_replace('/{([\w\d\-\_]+)}/miu', $replacement, $sql);

		return $this;
	}

	public function filter($name, $straight = null, $force_no_order = false) {
		$filter = new Filter($name);

		if(empty($filter->sql) && empty($filter->order)) {
			return $this;
		}

		if(isset($straight)) {
			$sql = !empty($filter->sql) ? "{$this->sql} $straight {$filter->sql}" : $this->sql;
		} else {
			$sql = !empty($filter->sql) ? "WHERE {$filter->sql}" : '';
			$sql = "SELECT * FROM ({$this->sql}) t_filter $sql";
		}

		foreach($filter->binding as $key => $value) {
			$this->addBinding($key, $value);
		}

		if(!empty($filter->order) && !$force_no_order) {
			$order_pattern = '/\s+(ORDER\s+BY[\s]+)([\w\s\@\<\>\.\,\=\-\'\"\`]+)$/mi';

			if(preg_match($order_pattern, $sql)) {
				$sql = preg_replace($order_pattern, " ORDER BY {$filter->order}, $2", $sql);
			} else {
				$sql .= " ORDER BY {$filter->order}";
			}
		}

		$this->sql = $sql;

		return $this;
	}

	public function paginate($total = null, $options = []) {
		if(isset($total)) {
			$this->pagination['total'] = $total;
		}

		foreach($options as $key => $option) {
			$this->pagination[$key] = $option;
		}

		$this->is_paginating = true;

		return $this;
	}

	private function initializePagination() {
		if(!$this->is_paginating) {
			return false;
		}

		$this->sql = preg_replace('/\s+(LIMIT|OFFSET)[\w\s\@\<\>\.\,\=\-\'\"\`]+$/mi', ' ', $this->sql);

		if(!isset($this->pagination['total'])) {
			// $total = "SELECT COUNT(*) FROM ({$this->sql}) as total";
			$total_sql = "SELECT COUNT(*) FROM " . $this->cutSelectionPartFromSQL($this->sql);

			$total_binding = [];

			foreach($this->binding as $key => $value) {
				if(str_contains($total_sql, ':' . $key)) {
					$total_binding[$key] = $value;
				}
			}

			$total = new Statement($total_sql);

			$this->pagination['total'] = $total->execute($total_binding)->fetchColumn();
		}

		$pagination = new Pagination($this->pagination['total'], $this->pagination);

		$this->sql = rtrim($this->sql, ';') . ' LIMIT :limit OFFSET :offset';

		$this->addBinding('limit', $pagination->limit);
		$this->addBinding('offset', $pagination->offset);

		return true;
	}

	private function cutSelectionPartFromSQL($sql) {
		$output = '';

		$sql_to_array = str_split($sql);

		$left_bracket_count = 0;
		$right_bracket_count = 0;
		$from_position = false;

		$sql_to_array_length = count($sql_to_array);

		for($i = 0; $i < $sql_to_array_length; $i++) {
			if($sql_to_array[$i] == '(') {
				$left_bracket_count += 1;
			}

			if($sql_to_array[$i] == ')') {
				$right_bracket_count += 1;
			}

			if($sql_to_array[$i] == 'f' || $sql_to_array[$i] == 'F') {
				$checkString = $sql_to_array[$i] . $sql_to_array[$i + 1] . $sql_to_array[$i + 2] . $sql_to_array[$i + 3];

				if($checkString == 'from' || $checkString == 'FROM') {
					$from_position = $i;

					if($left_bracket_count == $right_bracket_count) {
						$output = mb_substr($sql, $from_position + 4);

						break;
					}
				}
			}
		}

		return $output;
	}

	public function execute($params = []) {
		if($this->isCached()) {
			$this->addBinding($params);

			if($this->debug) {
				debug($this->binding);
				debug(trim($this->sql ?? ''));
			}

			return $this;
		}

		$this->addBinding($params);

		if($this->debug) {
			debug($this->binding);
			debug(trim($this->sql ?? ''));
		}

		$this->initializePagination();
		$this->prepare();
		$this->bind();

		try {
			$this->statement->execute();
		} catch(PDOException $error) {
			$error_message = $error->getMessage();

			if(preg_match("/Duplicate entry .+ for key '(.+)'/", $error->getMessage(), $matches)) {
				$error_message = str_replace(DATABASE['prefix'] . '_', '', $matches[1]);
				$error_message = 'duplicate:' . $error_message;
			}

			if(Request::$method === 'get') {
				debug(__($error_message));
				if(DEBUG['is_enabled']) debug($this->sql);
			} else {
				$debug_sql = DEBUG['is_enabled'] ? ['query' => preg_replace('/(\v|\s)+/', ' ', trim($this->sql ?? ''))] : null;
				Server::answer($debug_sql, 'error', __($error_message), '409');
			}
		}

		return $this;
	}

	private function isCached() {
		$is_cached = false;

		if(Module::get('name') === 'Public' && Setting::get('optimization')->cache_db == 'true') {
			if(preg_match('/^\s*SELECT/mi', $this->sql)) {
				$is_cached = true;
			}
		}

		return $is_cached;
	}

	private function fetchCache($type, $mode) {
		if($this->isCached()) {
			$cache_key = implode('@', $this->binding) . '@' . $this->sql;

			$cache = Cache::get($cache_key);

			if($cache) {
				return $cache;
			} else {
				$this->prepare();
				$this->bind();
				$this->statement->execute();

				$cache = $this->statement->{$type}($mode);

				Cache::set($cache_key, $cache);

				return $cache;
			}
		}

		return $this->statement->{$type}($mode);
	}

	public function fetchAll($mode = PDO::FETCH_OBJ) {
		return $this->fetchCache(__FUNCTION__, $mode);
	}

	public function fetch($mode = PDO::FETCH_OBJ) {
		return $this->fetchCache(__FUNCTION__, $mode);
	}

	public function fetchColumn(int $column = 0) {
		return intval($this->fetchCache(__FUNCTION__, $column));
	}

	public function insertId() {
		return Database::$connection->lastInsertId();
	}

	public function rowCount() {
		return $this->statement->rowCount();
	}

	private function prepare() {
		$this->statement = Database::$connection->prepare($this->sql);

		return true;
	}

	private function addBinding($key_or_array, $value = null) {
		if(empty($key_or_array)) {
			return false;
		}

		if(is_array($key_or_array)) {
			foreach($key_or_array as $k => $v) {
				$this->binding[strval($k)] = $v;
			}
		} else {
			$this->binding[strval($key_or_array)] = $value;
		}

		return true;
	}

	private function bind() {
		if(empty($this->binding)) {
			return false;
		}

		$pdo_param = PDO::PARAM_NULL;

		foreach($this->binding as $key => $value) {
			if(is_bool($value)) $pdo_param = PDO::PARAM_BOOL;
			if(is_int($value)) $pdo_param = PDO::PARAM_INT;
			if(is_string($value)) $pdo_param = PDO::PARAM_STR;

			if(is_array($value) || is_object($value)) {
				$pdo_param = PDO::PARAM_STR;
				$value = json_encode($value);
			}

			$this->statement->bindValue(':' . $key, $value, $pdo_param);
		}

		return true;
	}
}
