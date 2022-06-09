<?php

namespace Engine;

class Upload {
	public static function file($file, $custom_folder = '', $extensions = []) {
		$name = Hash::token(8);
		$name_original = $file['name'];

		$name_prepend = time();
		if(Auth::$user->authorized) {
			$name_prepend .= '_' . Auth::$user->id .'_';
		} else {
			$name_prepend .= '_uu_';
		}

		$size = $file['size'];
		$extension = strtolower(file_extension($file['name']));

		$path_dir = Define::UPLOAD_FOLDER;
		if(!empty($custom_folder)) {
			$path_dir = Define::UPLOAD_FOLDER . '/' . trim($custom_folder, '/');
		}
		$path_file = $path_dir . '/' . $name_prepend . $name . '.' . $extension;
		$path_full = ROOT_DIR . '/' . $path_file;

		$allowed_extensions = Define::UPLOAD_EXTENSIONS;
		if(!empty($extensions) && is_array($extensions)) {
			$allowed_extensions = $extensions;
		}

		try {
			if(!file_exists(ROOT_DIR . '/' . $path_dir)) {
				mkdir(ROOT_DIR . '/' . $path_dir, 0755, true);
			}

			if(is_array($allowed_extensions) && !empty($allowed_extensions) && !in_array($extension, $allowed_extensions)) {
				return self::response(false, "File extension .{$extension} is forbidden");
			}

			if($size > self::getMaxSize()) {
				return self::response(false, "Size of {$name_original} is too large");
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

		return $response;
	}
}
