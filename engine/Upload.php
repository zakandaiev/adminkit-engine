<?php

namespace Engine;

class Upload {
	public static function file($file, $custom_folder = '', $extensions = []) {
		$name = Hash::token(8);
		$name_original = $file['name'];

		$name_prepend = time();
		if(User::get()->authorized) {
			$name_prepend .= '_' . User::get()->id .'_';
		} else {
			$name_prepend .= '_uu_';
		}

		$size = $file['size'];
		$extension = strtolower(file_extension($file['name']));

		$path_dir = UPLOAD['folder'];
		if(!empty($custom_folder) && $custom_folder !== '/') {
			$path_dir = UPLOAD['folder'] . '/' . trim($custom_folder ?? '', '/');
		}
		$path_file = $path_dir . '/' . $name_prepend . $name . '.' . $extension;
		$path_full = ROOT_DIR . '/' . $path_file;

		$allowed_extensions = UPLOAD['extensions'];
		if(!empty($extensions) && is_array($extensions)) {
			$allowed_extensions = $extensions;
		}

		try {
			if(!file_exists(ROOT_DIR . '/' . $path_dir)) {
				mkdir(ROOT_DIR . '/' . $path_dir, 0755, true);
			}

			if(is_array($allowed_extensions) && !empty($allowed_extensions) && !in_array($extension, $allowed_extensions)) {
				return self::response(false, sprintf(__('File extension .%s is forbidden'), $extension));
			}

			if($size > self::getMaxSize()) {
				return self::response(false, sprintf(__('Size of %s is too large'), $name_original));
			}

			move_uploaded_file($file['tmp_name'], $path_full);

			return self::response(true, $path_file);
		} catch(\Exception $e) {
			return self::response(false, $e->getMessage());
		}
	}

	public static function getMaxSize() {
		$amount = ini_get('upload_max_filesize');

		if(is_int($amount)) {
			return $amount;
		}

		$units = ['', 'K', 'M', 'G'];
		preg_match('/(\d+)\s?([KMG]?)/', ini_get('upload_max_filesize'), $matches);
		[$_, $nr, $unit] = $matches;
		$exp = array_search($unit, $units);

		return (int) $nr * pow(1024, $exp);
	}

	private static function response($status, $message = null) {
		$response = new \stdClass;

		$response->status = $status;
		$response->message = $message;

		if($status) {
			Log::write(Path::url() . '/' . $message . ' uploaded from IP: ' . Request::$ip, 'upload');

			Hook::run('upload', $message);
		}

		return $response;
	}
}
