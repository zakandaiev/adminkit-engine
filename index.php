<?php

define('ROOT_DIR', $_SERVER['DOCUMENT_ROOT']);

require_once ROOT_DIR . '/vendor/autoload.php';

$is_install = str_starts_with($_SERVER['REQUEST_URI'], '/install');

if(!is_file(ROOT_DIR . '/config/database.php') && !$is_install) {
	\Engine\Server::redirect('/install');
}
if(is_file(ROOT_DIR . '/config/database.php') && $is_install) {
	\Engine\Server::redirect('/');
}

if($is_install) {
	require_once ROOT_DIR . '/module/Install/install.php';
	exit;
}

$version_compare = version_compare($version = phpversion(), $required = \Engine\Define::PHP_MIN, '<');
if($version_compare) {
	$error_message = '<h1 style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">You are running PHP ' . $version . ', but it needs at least PHP ' . $required . ' to run.</h1>';
	exit($error_message);
}

try {
	\Engine\Engine::start();
} catch (\ErrorException $e) {
	echo $e->getMessage();
}

\Engine\Engine::stop();
