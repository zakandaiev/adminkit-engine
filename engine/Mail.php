<?php

namespace Engine;

use Engine\Database\Statement;

class Mail {
	private static $mail = [];

	public static function send($file_name, $recepient, $data = null, $forced = false) {
		$mail = self::load($file_name, $data);

		if(!is_array($mail) || !isset($mail['subject']) || !isset($mail['message'])) {
			return false;
		}

		$mail['subject'] = trim($mail['subject'] ?? '');
		$mail['message'] = trim($mail['message'] ?? '');
		$mail['from'] = $mail['from'] ?? null;

		if(empty($mail['subject']) || empty($mail['message'])) {
			return false;
		}

		if(!$forced) {
			$sql = 'SELECT * FROM {user} WHERE email = :email ORDER BY date_created DESC LIMIT 1';

			$user = new Statement($sql);

			$user = $user->execute(['email' => $recepient])->fetch();

			$user = User::format($user);

			if(!$user || @$user->setting->notifications->{'mail_' . $mail['type']} === false) {
				return false;
			}
		}

		self::mail($recepient, $mail['subject'], $mail['message'], $mail['from']);
	}

	public static function mail($recepient, $subject, $message, $from = null) {
		$recepient = trim($recepient ?? '');
		$subject = trim($subject ?? '');
		$message = trim($message ?? '');
		$from = $from ?? Setting::get('contact')->email;

		$headers = [
			'Content-type' => 'text/html',
			'charset' => 'utf-8',
			'MIME-Version' => '1.0',
			'From' => Setting::get('site')->name . '<'.$from.'>',
			'Reply-To' => $from
		];

		Log::write($subject .  ' sent to ' . $recepient . ' from IP: ' . Request::$ip, 'mail');

		$data = new \stdClass();
		$data->recepient = $recepient;
		$data->subject = $subject;
		$data->message = $message;
		$data->from = $from;
		$data->headers = $headers;

		Hook::run('mail_send', $data);

		return mail($recepient, $subject, $message, $headers);
	}

	public static function load($file_name, $data) {
		$mail = self::$mail;

		if(is_array($mail) && !empty($mail)) {
			return $mail;
		}

		$path_mail = Path::file('mail') . '/' . $file_name . '.php';

		if(!is_file($path_mail)) {
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
