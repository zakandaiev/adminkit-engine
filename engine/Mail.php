<?php

namespace Engine;

class Mail {
	private static $mail = [];

	public static function send($file_name, $data = null) {
		$mail = self::load($file_name, $data);

		if(!is_array($mail)) {
			return false;
		}

		if(!isset($mail['recepient']) || !isset($mail['subject']) || !isset($mail['message'])) {
			return false;
		}

		$mail['message'] = trim($mail['message'] ?? '');
		$mail['from'] = $mail['from'] ?? null;

		if(empty($mail['recepient']) || empty($mail['subject']) || empty($mail['message'])) {
			return false;
		}

		self::mail($mail['recepient'], $mail['subject'], $mail['message'], $mail['from']);
	}

	public static function mail($recepient, $subject, $message, $from = '') {
		$to = trim($recepient ?? '');
		$subj = trim($subject ?? '');
		$msg = trim($message ?? '');
		$frm = Setting::get('contact')->email;

		if(!empty($from)) {
			$frm = trim($from ?? '');
		}

		$headers = [
			'Content-type' => 'text/html',
			'charset' => 'utf-8',
			'MIME-Version' => '1.0',
			'From' => Setting::get('site')->name . '<'.$frm.'>',
			'Reply-To' => $frm
		];

		Log::write($subj .  ' sent to ' . $to . ' from IP: ' . Request::$ip, 'mail');

		Hook::run('mail_send');

		return mail($to, $subj, $msg, $headers);
	}

	public static function load($file_name, $data) {
		$mail = self::$mail;

		if(is_array($mail) && !empty($mail)) {
			return $mail;
		}

		$path_mail = Path::file('mail') . '/' . $file_name . '.php';

		if(!file_exists($path_mail)) {
			return [];
		}

		$content_mail = require $path_mail;

		if(!is_array($content_mail)) {
			return [];
		}

		self::$mail = $content_mail;

		return $content_mail;
	}
}
