<?php

namespace Engine;

class Define {
	const SHOW_ERRORS = true;

	const PHP_MIN = '7.0.0';

	const NAME = 'CMS';
	const VERSION = '1.0.0';

	// move to DB setting
	const AUTH_DAYS = 7;
	const UPLOAD_FOLDER = 'upload';
	const UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

	const VIEW_PATH_MASK = [
		'module' => '%s/View/%s',
		'theme' => '%s/theme/%s'
	];
}
