<?php

namespace Engine\Database;

use \PDO;
use \PDOException;

use Engine\Cache;
use Engine\Module;
use Engine\Server;
use Engine\Setting;
use Engine\Theme\Pagination;

class Statement {
	private $sql;
	private $prefix;
	private $statement;
	private $binding = [];

	public function __construct(string $sql) {
		$this->prefix = DATABASE['prefix'];

		$replacement = '$1';
		if(!empty($this->prefix)) {
			$replacement = $this->prefix.'_$1';
		}

		$this->sql = preg_replace('/{([^{}]+)}/miu', $replacement, $sql);

		return $this;
	}

	public function paginate($total_rows, $limit = null, $offset = null) {
		$pagination = new Pagination($total_rows);

		$this->sql = $this->sql . ' LIMIT :limit OFFSET :offset';

		$this->addBinding('limit', $limit ?? $pagination->limit);
		$this->addBinding('offset', $offset ?? $pagination->offset);

		return $this;
	}

	public function execute($params = []) {
		if($this->isCached()) {
			$this->addBinding($params);
			return $this;
		}

		$this->prepare();
		$this->addBinding($params);
		$this->bind();

		try {
			$this->statement->execute();
		} catch(PDOException $error) {
			$error_message = $error->getMessage();

			if(preg_match("/Duplicate entry .+ for key '(.+)'/", $error->getMessage(), $matches)) {
				$error_message = str_replace(DATABASE['prefix'] . '_', '', $matches[1]);
				$error_message = str_replace('.', '_', $error_message);
				$error_message = 'duplicate/' . $error_message;
			}

			$debug_sql = DEBUG['is_enabled'] ? ['query' => preg_replace('/(\v|\s)+/', ' ', trim($this->sql ?? ''))] : null;

			Server::answer($debug_sql, 'error', $error_message, '409');
		}

		return $this;
	}

	private function isCached() {
		$is_cached = false;

		if(Module::$name === 'Public' && Setting::get('optimization')->cache_db == 'true') {
			if(preg_match('/^[\s]*SELECT/i', $this->sql)) {
				$is_cached = true;
			}
		}

		return $is_cached;
	}

	private function cache() {


		return $this;
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
		return $this->fetchCache(__FUNCTION__, $column);
	}

	public function insertId() {
		return Database::$connection->lastInsertId();
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

			if(is_array($value)) {
				$pdo_param = PDO::PARAM_STR;
				$value = json_encode($value);
			}

			$this->statement->bindValue(':' . $key, $value, $pdo_param);
		}

		return true;
	}
}
