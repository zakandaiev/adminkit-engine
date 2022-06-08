<?php

namespace Engine;

use Engine\Database\Statement;

class Form {
	private static $form = [];
	private static $token;

	public static function add($form_name) {
		return self::generateToken(__FUNCTION__, $form_name);
	}

	public static function edit($form_name, $item_id) {
		return self::generateToken(__FUNCTION__, $form_name, $item_id);
	}

	public static function delete($form_name, $item_id) {
		return self::generateToken(__FUNCTION__, $form_name, $item_id);
	}

	private static function generateToken($action, $form_name, $item_id = null) {
		$form = self::load($form_name);

		if(!empty($form)) {
			if(self::tokenExistsAndActive($action, $form_name, $item_id)) {
				return Request::$base . '/' . self::$token;
			}

			$token = Hash::token();

			$query_params = ['module' => Module::get('name'), 'token' => $token, 'action' => $action, 'form_name' => $form_name];

			$query_append_field = '';
			$query_append_binding = '';
			if($action !== 'add') {
				$query_append_field = ', item_id';
				$query_append_binding = ', :item_id';
				$query_params['item_id'] = $item_id;
			}

			$sql = '
				INSERT INTO {form}
					(token, module, action, form_name' . $query_append_field . ')
				VALUES
					(:token, :module, :action, :form_name' . $query_append_binding . ')
			';

			$statement = new Statement($sql);
			$statement->execute($query_params);

			return Request::$base . '/' . $token;
		}

		return null;
	}

	public static function execute($action, $form_name, $item_id = null, $force_no_answer = false) {
		self::clearExpired();

		self::check($form_name);

		$form = self::load($form_name);
		$table = $form['table'];

		if($action !== 'delete') {
			$fields = self::processFields($form_name);
		}

		if($action !== 'add') {
			$statement = new Statement('SHOW KEYS FROM {' . $table . '} WHERE Key_name=\'PRIMARY\'');
			$pk_name = $statement->execute()->fetch()->Column_name;
			$fields[$pk_name] = $item_id;
		}

		$form_data = ['action' => $action, 'form_name' => $form_name, 'item_id' => $item_id];

		if(isset($form['modify_fields']) && is_callable($form['modify_fields'])) {
			$data = new \stdClass();

			$data->fields = $fields;
			$data->form_data = $form_data;

			$fields = $form['modify_fields']($data)->fields;
			$form_data = $form['modify_fields']($data)->form_data;
		}

		if(isset($form['execute_pre']) && is_callable($form['execute_pre'])) {
			$data = new \stdClass();

			$data->fields = $fields;
			$data->form_data = $form_data;

			$form['execute_pre']($data);
		}

		if(isset($form['execute']) && is_callable($form['execute'])) {
			$data = new \stdClass();

			$data->fields = $fields;
			$data->form_data = $form_data;

			$form['execute']($data);
		} else {
			$fields_foreign = [];
			$fields_foreign_value = [];
			if($action !== 'delete') {
				foreach($form['fields'] as $field => $values_array) {
					if(isset($values_array['foreign']) && !empty($values_array['foreign'])) {

						if(is_callable($values_array['foreign'])) {
							$fields_foreign[$field] = $values_array['foreign'];
						} else {
							$foreign_t = explode('@', $values_array['foreign'], 2);
							$foreign_k = explode('/', $foreign_t[1], 2);

							$foreign_table = $foreign_t[0];
							$foreign_key_1 = $foreign_k[0];
							$foreign_key_2 = $foreign_k[1];

							$fields_foreign[$field]['table'] = $foreign_table;
							$fields_foreign[$field]['key_1'] = $foreign_key_1;
							$fields_foreign[$field]['key_2'] = $foreign_key_2;
						}

						if(is_array($fields[$field])) {
							$fields_foreign_value[$field] = $fields[$field];
						} else if(@json_decode($fields[$field]) || $fields[$field] === '[]') {
							$fields_foreign_value[$field] = json_decode($fields[$field]) ?? [];
						} else if(!empty($fields[$field])) {
							$fields_foreign_value[$field] = array($fields[$field]);
						} else {
							$fields_foreign_value[$field] = [];
						}

						unset($fields[$field]);
					}
				}
			}

			switch($action) {
				case 'add': {
					$columns = implode(', ', array_keys($fields));
					$bindings = ':' . implode(', :', array_keys($fields));
					$sql = 'INSERT INTO {' . $table . '} (' . $columns . ') VALUES (' . $bindings . ')';
					break;
				}
				case 'edit': {
					$bindings = array_reduce(array_keys($fields),function($carry,$v){return ($carry?"$carry, ":'')."$v = :$v";});
					$sql = 'UPDATE {' . $table . '} SET ' . $bindings . ' WHERE ' . $pk_name . ' = :' . $pk_name;
					break;
				}
				case 'delete': {
					$sql = 'DELETE FROM {' . $table . '} WHERE ' . $pk_name . ' = :' . $pk_name;
					break;
				}
				default: {
					return false;
				}
			}

			if(isset($form['modify_sql']) && is_callable($form['modify_sql'])) {
				$data = new \stdClass();

				$data->sql = $sql;
				$data->fields = $fields;
				$data->form_data = $form_data;

				$sql = $form['modify_sql']($data)->sql;
				$fields = $form['modify_sql']($data)->fields;
				$form_data = $form['modify_sql']($data)->form_data;
			}

			$statement = new Statement($sql);
			$statement->execute($fields);

			if($action === 'add' && empty($item_id)) {
				$item_id = $statement->insertId();
				$form_data['item_id'] = $item_id;
			}

			foreach($fields_foreign as $field_name => $field) {
				if(is_callable($field)) {
					$data = new \stdClass();

					$data->fields = $fields;
					$data->form_data = $form_data;

					$field($fields_foreign_value[$field_name], $data);
				}
				else if(is_array($field)) {
					$sql = 'DELETE FROM {' . $field['table'] . '} WHERE ' . $field['key_1'] . ' = :' . $field['key_1'];

					$statement = new Statement($sql);
					$statement->execute([$field['key_1'] => $item_id]);

					if(empty($fields_foreign_value[$field_name])) {
						continue;
					}

					foreach($fields_foreign_value[$field_name] as $value) {
						$sql = '
							INSERT INTO {' . $field['table'] . '}
								(' . $field['key_1'] . ', ' . $field['key_2'] . ')
							VALUES
								(:' . $field['key_1'] . ', :' . $field['key_2'] . ')
						';

						$statement = new Statement($sql);
						$statement->execute([$field['key_1'] => $item_id, $field['key_2'] => $value]);
					}
				}
			}
		}

		if(isset($form['execute_post']) && is_callable($form['execute_post'])) {
			$data = new \stdClass();

			$data->fields = $fields;
			$data->form_data = $form_data;

			$form['execute_post']($data);
		}

		if(isset($form['submit'])) {
			if(is_callable($form['submit'])) {
				$submit_message = $form['submit']($fields, $form_data);
			} else {
				$submit_message = $form['submit'];
			}
		}

		if(!$force_no_answer) {
			Server::answer(null, 'success', @$submit_message);
		}
	}

	private static function tokenExistsAndActive($action, $form_name = '', $item_id = '') {
		$query_defining = 'action = :action AND form_name = :form_name AND item_id = :item_id';
		$query_params = ['action' => $action, 'form_name' => $form_name, 'item_id' => $item_id];

		if($action === 'add') {
			$query_defining = 'action = :action AND form_name = :form_name';
			$query_params = ['action' => $action, 'form_name' => $form_name];
		}

		$sql = '
			SELECT token FROM {form}
			WHERE
				' . $query_defining . '
				AND date_created > DATE_SUB(NOW(), INTERVAL ' . Define::LIFETIME['form'] . ' SECOND)
		';

		$statement = new Statement($sql);

		$token_query = $statement->execute($query_params)->fetch();

		if(!isset($token_query->token)) {
			return false;
		}

		self::$token = $token_query->token;

		return true;
	}

	private static function clearExpired() {
		$statement = new Statement('DELETE FROM {form} WHERE date_created <= DATE_SUB(NOW(), INTERVAL ' . intval(Define::LIFETIME['form']) * 2 . ' SECOND)');
		$statement->execute();

		return true;
	}

	private static function load($form_name) {
		if(isset(self::$form[$form_name])) {
			return self::$form[$form_name];
		}

		$form = Path::file('form') . '/' . $form_name . '.php';
		$form_data = [];

		if(file_exists($form)) {
			$form_data = include $form;
		}

		self::$form[$form_name] = $form_data;

		return $form_data;
	}

	public static function check($form_name) {
		$form = self::load($form_name);

		if(empty($form)) {
			return false;
		}

		$post = Request::$post;

		foreach($form['fields'] as $field => $values_array) {
			if(array_key_exists($field, $post)) {
				foreach($values_array as $key => $value) {
					if(isset($values_array['required']) && !$values_array['required'] && empty($post[$field])) {
						$check = true;
					} else {
						$check = self::isFieldValid($post[$field], $key, $value);
					}

					if($check !== true) {
						$error_message = $values_array[$key . '_message'] ?? ucfirst($field) . ' ' . $key . ' is ' . (is_bool($value) ? 'true' : $value);

						Server::answer(null, 'error', $error_message, 409);
					}
				}
			}
		}

		return true;
	}

	private static function isFieldValid($value, $operand, $operand_value) {
		switch($operand) {
			case 'boolean': {
				if($operand_value) {
					return true;
				}
				return false;
			}
			case 'required': {
				if($operand_value && !empty($value)) {
					return true;
				} else if(!$operand_value) {
					return true;
				}
				return false;
			}
			case 'int': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_INT)) {
					return true;
				}
				return false;
			}
			case 'float': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_FLOAT)) {
					return true;
				}
				return false;
			}
			case 'email': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_EMAIL)) {
					return true;
				}
				return false;
			}
			case 'ip': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_IP)) {
					return true;
				}
				return false;
			}
			case 'mac': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_MAC)) {
					return true;
				}
				return false;
			}
			case 'url': {
				if($operand_value && filter_var($value, FILTER_VALIDATE_URL)) {
					return true;
				}
				return false;
			}
			case 'min': {
				$value = intval($value);
				$operand_value = intval($operand_value);
				return $value >= $operand_value ? true : false;
			}
			case 'max': {
				$value = intval($value);
				$operand_value = intval($operand_value);
				return $value <= $operand_value ? true : false;
			}
			case 'minlength': {
				$value = intval(mb_strlen($value));
				$operand_value = intval($operand_value);
				return $value >= $operand_value ? true : false;
			}
			case 'maxlength': {
				$value = intval(mb_strlen($value));
				$operand_value = intval($operand_value);
				return $value <= $operand_value ? true : false;
			}
			case 'regexp': {
				return preg_match($operand_value, $value) ? true : false;
			}
			case 'regexp2': {
				return preg_match($operand_value, $value) ? true : false;
			}
			case 'regexp3': {
				return preg_match($operand_value, $value) ? true : false;
			}
		}

		return true;
	}

	public static function processFields($form_name) {
		$form = self::load($form_name);

		if(empty($form)) {
			return [];
		}

		$post = Request::$post;
		$files = Request::$files;
		$fields = [];

		foreach($form['fields'] as $field => $values_array) {
			$field_value = null;

			if(!isset($post[$field]) || empty($post[$field])) {
				if(isset($values_array['boolean']) && $values_array['boolean']) {
					$field_value = false;
				}
				if(isset($values_array['unset_null']) && $values_array['unset_null']) {
					continue;
				}

				$fields[$field] = $field_value;
			} else {
				$field_value = $post[$field];
				$is_field_formatted = false;

				if(isset($values_array['boolean']) && $values_array['boolean']) {
					$field_value = $field_value === 'null' ? false : true;
					$is_field_formatted = true;
				}
				if(isset($values_array['html']) && $values_array['html']) {
					$field_value = trim($field_value);
					$is_field_formatted = true;
				}
				if(isset($values_array['json']) && $values_array['json']) {
					$field_value = trim($field_value);
					$is_field_formatted = true;
				}
				if(isset($values_array['foreign'])) {
					$field_value = $field_value;
					$is_field_formatted = true;
				}
				if(is_array($field_value)) {
					$field_value = filter_var_array($field_value, FILTER_SANITIZE_STRING);
					$field_value = json_encode($field_value);
					$is_field_formatted = true;
				}

				if(!$is_field_formatted) {
					$field_value = filter_var(trim($field_value), FILTER_SANITIZE_STRING);
				}

				$fields[$field] = $field_value;
			}

			if(isset($values_array['modify']) && is_callable($values_array['modify'])) {
				$fields[$field] = $values_array['modify']($fields[$field]);
			}
		}

		foreach($form['fields'] as $field => $values_array) {
			if(isset($values_array['file']) && $values_array['file']) {

				if(!isset($files[$field]) || empty($files[$field]['tmp_name'])) {
					continue;
				}

				$files_array = [];
				$is_multiple = false;

				if(is_array($files[$field]['tmp_name'])) {
					$is_multiple = true;
					foreach($files[$field] as $key => $file) {
						foreach($file as $num => $val) {
							$files_array[$num][$key] = $val;
						}
					}
				} else {
					$files_array[] = $files[$field];
				}

				foreach($files_array as $file) {
					if(empty($file['tmp_name'])) {
						continue;
					}

					$upload = Upload::file($file, $values_array['folder'] ?? null, $values_array['extensions'] ?? null);

					if($upload->status === true) {
						if(!$is_multiple) {
							$fields[$field] = $upload->message;
							continue;
						}

						if(isset($fields[$field]) && !empty($fields[$field])) {
							$fields[$field] = json_decode($fields[$field]);

							if(!empty($fields[$field])) {
								$fields[$field][] = $upload->message;
							} else {
								$fields[$field] = array($upload->message);
							}
						} else {
							$fields[$field] = array($upload->message);
						}

						$fields[$field] = json_encode($fields[$field]);
					} else {
						Server::answer(null, 'error', $upload->message, 415);
					}
				}
			}
		}

		return $fields;
	}

	public static function populateFiles($files = null) {
		$output_array = [];

		if(empty($files)) {
			return json_encode($output_array);
		}

		if(!is_array($files) && $files[0] === "[") {
			$files_array = json_decode($files);
		} else {
			$files_array = array($files);
		}

		foreach($files_array as $file) {
			$poster = Request::$base . '/' . $file;

			$output_array[] = [
				'value' => $file,
				'poster' => $poster
			];
		}

		return json_encode($output_array);
	}
}
