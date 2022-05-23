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
	private $is_prepared = false;

	public function __construct(string $sql) {
		$this->prefix = Config::get('database')['prefix'];

		$replacement = '$1';
		if(!empty($this->prefix)) {
			$replacement = $this->prefix.'_$1';
		}

		$this->sql = preg_replace('/{([^{}]+)}/miu', $replacement, $sql);

		return $this;
	}

	public function prepare() {
		$this->statement = Database::$connection->prepare($this->sql);

		return $this;
	}

	public function bind($params) {
		if(!is_array($params) || empty($params)) {
			return $this;
		}

		if(!$this->is_prepared) {
			$this->prepare();
		}

		$pdo_param = PDO::PARAM_NULL;

		foreach($params as $key => $value) {
			if(is_bool($value)) $pdo_param = PDO::PARAM_BOOL;
			if(is_int($value)) $pdo_param = PDO::PARAM_INT;
			if(is_string($value)) $pdo_param = PDO::PARAM_STR;
			
			if(is_array($value)) {
				$value = json_encode($value);
			}

			$this->statement->bindValue(':' . $key, $value, $pdo_param);
		}

		return $this;
	}

	public function paginate($total_rows, $parameters = []) {
		$this->sql = $this->sql . ' OFFSET :offset LIMIT :limit;';

		Pagination::initialize($total_rows);

		$binding = [
			'offset' => $parameters['offset'] ?? Pagination::$offset,
			'limit' => $parameters['limit'] ?? Pagination::$limit
		];

		$this->bind($binding);

		return $this;
	}

	public function execute() {
		if(!$this->is_prepared) {
			$this->prepare();
		}

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
}
