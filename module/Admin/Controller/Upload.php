<?php

namespace Module\Admin\Controller;

use Engine\Request;
use Engine\Server;
// use Engine\Upload;

class Upload extends AdminController {
	/* public function get() {
		if(!isset(Request::$get['load'])) {
			Server::redirect('/404');
		}

		exit('Content-Disposition: inline; filename="' . Request::$get['load'] . '"');
	} */

	public function post() {
		/*$files = Request::$files;

		if(empty($files)) {
			http_response_code(415);
			exit;
		}

		$files = $files[array_key_first($files)];
		$files = array_map(function($n){if(is_array($n)){return strval($n[0]);}return $n;}, $files);

		$upload = Upload::file($files);

		if($upload->status === true) {
			Server::answer(null, 'success', $upload->message);
		}

		http_response_code(415);
		Server::answer(null, 'error', $upload->message);*/
		exit;
	}

	public function delete() {
		// remove temp file and return empty page
		// ! should delete only TEMP file, not submitted to DB - not realized yet !
		exit;
	}
}
