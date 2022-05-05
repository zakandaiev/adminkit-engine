<?php

namespace Engine;

class Define {
	const SHOW_ERRORS = true;

	const PHP_MIN = '7.0.0';

	const NAME = 'CMS';
	const VERSION = '1.0.0';
	const AUTHOR = 'github.com/zakandaiev';

	const COOKIE_KEY = [
		'auth' => 'auth_token',
		'csrf' => 'csrf_token',
		'language' => 'language'
	];

	const AUTH_DAYS = 7;
	const UPLOAD_FOLDER = 'upload';
	const UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'zip', 'rar'];

	const VIEW_PATH_MASK = [ // TODO
		'module' => '%s/View/%s',
		'theme' => '%s/theme/%s'
	];

	const SERVICE = [
		'ip_checker' => 'https://check-host.net/ip-info?host=%s'
	];
}
