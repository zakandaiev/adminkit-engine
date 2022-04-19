<?php

namespace Module\Public\Controller;

class Error extends Controller {
	public function get404() {
		$this->view->error('404');

		return true;
	}
}