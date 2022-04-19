<?php

namespace Engine;

class Server {
	public static function answer($answer = null, $status = '', $message = '', $code = 200) {
		if(empty($answer)) {
			$answer = array('status' => $status, 'message' => $message);
			$answer = json_encode($answer);
		} else if(is_array($answer)) {
			if(!isset($answer['status'])) {
				$answer['status'] = $status;
			}
			if(!isset($answer['message'])) {
				$answer['message'] = $message;
			}
			
			$answer = json_encode($answer);
		}

		http_response_code($code);
		header('Content-Type: text/plain');

		exit(strval($answer));
	}

	public static function redirect($url, $permanent = false) {
		if($permanent) {
			header('Location: ' . $url, true, 301);
		} else {
			header('Location: ' . $url);
		}
		exit();
	}
}
