<?php

define('ROOT_DIR', $_SERVER['DOCUMENT_ROOT']);

require_once ROOT_DIR . '/vendor/autoload.php';

if(\Engine\Define::DEBUG) {
	$engine_time_start = hrtime(true);
}

$version_compare = version_compare($version = phpversion(), $required = \Engine\Define::PHP_MIN, '<');
if($version_compare) {
	$error_message = '<h1 style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">You are running PHP ' . $version . ', but it needs at least PHP ' . $required . ' to run.</h1>';
	exit($error_message);
}

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

try {
	\Engine\Engine::start();
} catch (\ErrorException $error) {
	echo $error->getMessage();
}

\Engine\Engine::stop();

if(\Engine\Define::DEBUG) {
	$engine_time_end = hrtime(true);
	$engine_time_result = $engine_time_end - $engine_time_start;
	$engine_time_result /= 1e+6; // convert ns to ms

	echo "<!--";
	echo "\n\tExecution time: $engine_time_result ms";
	echo "\n-->";
}
