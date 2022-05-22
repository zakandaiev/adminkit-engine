<?php

namespace Engine;

class Define {
	// DEBUG
	const SHOW_ERRORS = true;

	// LOG
	const LOG_FOLDER = 'log';
	const LOG_FILENAME = 'Y-m-d';
	const LOG_EXTENSION = 'log';

	// REQUIREMENTS
	const PHP_MIN = '7.0.0';

	// META
	const NAME = 'CMS';
	const VERSION = '1.0.0';
	const AUTHOR = 'https:://zakandaiev.pp.ua';

	// COOKIES
	const COOKIE_KEY = [
		'auth' => 'auth_token',
		'csrf' => 'csrf_token',
		'language' => 'language'
	];

	// AUTH
	const AUTH_DAYS = 7;

	// UPLOADS
	const UPLOAD_FOLDER = 'upload';
	const UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'zip', 'rar'];

	// TODO
	const VIEW_PATH_MASK = [
		'module' => '%s/View/%s',
		'theme' => '%s/theme/%s'
	];

	// SERVICES
	const SERVICE = [
		'ip_checker' => 'https://check-host.net/ip-info?host=%s'
	];
}
