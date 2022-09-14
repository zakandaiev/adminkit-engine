<?php

define('ROOT_DIR', $_SERVER['DOCUMENT_ROOT']);

if(!is_file(ROOT_DIR . '/config.php')) {
	file_put_contents(ROOT_DIR . '/config.php', '');
}

require_once ROOT_DIR . '/vendor/autoload.php';

use Engine\Engine;
use Engine\Server;

$version_compare = version_compare($version = phpversion(), $required = Engine::PHP_MIN, '<');

if($version_compare) {
	$error_message = '<h1 style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">You are running PHP ' . $version . ', but it needs at least PHP ' . $required . ' to run.</h1>';
	exit($error_message);
}

$is_install = (strtok($_SERVER['REQUEST_URI'], '?') === '/install');

if(!defined('DATABASE') && !$is_install) {
	Server::redirect('/install');
}
if(defined('DATABASE') && $is_install) {
	Server::redirect('/');
}

if($is_install) {
	require_once ROOT_DIR . '/module/Install/Engine/install.php';
	exit;
}

try {
	Engine::start();
} catch (\ErrorException $error) {
	echo $error->getMessage();
}

Engine::stop();
