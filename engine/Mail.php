<?php

namespace Engine;

class Mail {
	public static function send($recepient, $subject, $message, $from = '') {
		$to = trim($recepient);
		$subj = trim($subject);
		$msg = trim($message);
		$frm = Setting::get('site')->email;
		if(!empty($from)) {
			$frm = trim($from);
		}
		$headers = [
			'Content-type' => 'text/html',
			'charset' => 'utf-8',
			'MIME-Version' => '1.0',
			'From' => Setting::get('site')->name . '<'.$frm.'>',
			'Reply-To' => $frm
		];

		return mail($to, $subj, $msg, $headers);
	}
}
