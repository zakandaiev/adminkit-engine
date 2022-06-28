<?php

namespace Module\Admin\Controller;

use Engine\Request;
use Engine\Server;

class Upload extends AdminController {
	public function get() {
		if(!isset(Request::get('load'))) {
			Server::redirect('/404');
		}

		exit('Content-Disposition: inline; filename="' . Request::get('load') . '"');
	}

	public function post() {
		$file = Request::$files;

		if(empty($file)) {
			Server::answerEmpty(415);
		}

		$file = $file[array_key_first($file)];
		$file = array_map(function($n){if(is_array($n)){return strval($n[0]);}return $n;}, $file);

		$upload = \Engine\Upload::file($file);

		if($upload->status === true) {
			Server::answer($upload->message);
		}

		Server::answer(null, 'error', $upload->message, 415);
	}

	public function delete() {
		// remove temp file and return empty page
		// ! should delete only TEMP file, not submitted to DB - not realized yet !
		Server::answerEmpty();
	}
}
