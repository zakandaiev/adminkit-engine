<?php

namespace Engine\Database;

use \PDO;
use \PDOException;

use Engine\Define;
use Engine\Config;
use Engine\Server;
use Engine\Theme\Pagination;

class Statement {
	private $sql;
	private $prefix;
	private $statement;
	private $binding = [];

	public function __construct(string $sql) {
		$this->prefix = Config::get('database')['prefix'];

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
		$this->prepare();
		$this->addBinding($params);
		$this->bind();

		try {
			$this->statement->execute();
		} catch(PDOException $error) {
			$language_key = '';

			if(preg_match("/Duplicate entry .+ for key '(.+)'/", $error->getMessage(), $matches)) {
				$language_key = str_replace(Config::get('database')['prefix'] . '_', '', $matches[1]);
				$language_key = str_replace('.', '_', $language_key);
				$language_key = 'duplicate/' . $language_key;
			}

			$error_message = __($language_key);

			if(!$error_message) {
				$error_message = $error->getMessage();
			}

			$debug_sql = Define::SHOW_ERRORS ? ['query' => $this->sql] : null;

			Server::answer($debug_sql, 'error', $error_message, '409');
		}

		return $this;
	}

	public function fetchAll($mode = PDO::FETCH_OBJ) {
		return $this->statement->fetchAll($mode);
	}

	public function fetch($mode = PDO::FETCH_OBJ) {
		return $this->statement->fetch($mode);
	}

	public function fetchColumn(int $column = null) {
		return $this->statement->fetchColumn($column);
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
