<?php

namespace Engine;

class Define {
	// DEBUG
	const DEBUG = true;
	const DEBUG_LANG_WRAP = '_';

	// CACHE
	const CACHE_FOLDER = 'cache';
	const CACHE_EXTENSION = 'bin';

	// LOG
	const LOG_FOLDER = 'log';
	const LOG_FILENAME = 'Y-m-d';
	const LOG_EXTENSION = 'log';

	// REQUIREMENTS
	const PHP_MIN = '7.0.0';

	// META
	const NAME = 'CMS';
	const VERSION = '1.0.0';
	const AUTHOR = 'Zakandaiev';
	const AUTHOR_URL = 'https://zakandaiev.pp.ua';

	// COOKIES
	const COOKIE_KEY = [
		'auth' => 'auth_token',
		'csrf' => 'csrf_token',
		'language' => 'language'
	];

	// LIFETIME (seconds)
	const LIFETIME = [
		'auth' => 3600 * 24 * 7, // 7 days
		'cache' => 3600, // 1 hour
		'form' => 3600 * 24 * 0.5 // 12 hours
	];

	// UPLOAD
	const UPLOAD_FOLDER = 'upload';
	const UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'zip', 'rar'];

	// SERVICE
	const SERVICE = [
		'ip_checker' => 'https://check-host.net/ip-info?host=%s'
	];

	// PAGINATION
	const PAGINATION_URI_KEY = 'page';
}
