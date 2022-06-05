<?php

namespace Engine;

class Hash {
	public static function token($length = 32) {
		return bin2hex(random_bytes($length));
	}

	public static function password($password) {
		return password_hash($password, PASSWORD_DEFAULT);
	}

	public static function generatePassword($length = 16) {
		$chars = "abcdefghijklmanopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$chars_size = strlen($chars);
		$password = "";

		for($i = 0; $i < $length; $i++) {
			$password .= $chars[rand(0, $chars_size - 1)];
		}

		return $password;
	}
}
