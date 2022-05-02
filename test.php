<?php

define('ROOT_DIR', $_SERVER['DOCUMENT_ROOT']);

$module_name = filter_var($_GET['module'], FILTER_SANITIZE_STRING) ?? null;

if(!$module_name) {
	echo 'Enter module name';
	exit;
}

define('MODULE_DIR', ROOT_DIR . '/module/' . $module_name);
echo MODULE_DIR;
exit;

define('LANGUAGES_DIR', 'Languages');
define('TEMPLATE_NAME', 'lang@lang_REGION@LanguageName.ini');

function glob_recursive($pattern, $flags = 0) {
	$files = glob($pattern, $flags);

	foreach(glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
		$files = array_merge($files, glob_recursive($dir . '/' . basename($pattern), $flags));
	}

	return $files;
}

// FIND ALL .php FILES
$path = sprintf(MODULE_DIR_MASK, ) . '/*.php';

echo $path;
exit;

$php_files = glob_recursive($path);

// SCAN THESE FILES FOR MATCHES
$langs = [];

foreach($php_files as $file) {
  $content = file_get_contents($file);

	$slug = preg_match_all('/\_\_\((.*?)\)/s', $content, $matches);

	if(!$slug) {
		continue;
	}

	foreach($matches[1] as $match) {
		$langs[str_replace("'", "", $match)][] = $file;
	}
}

// SAVE TEMPLATE FILE
if(is_file(FILENAME)) {
	unlink(FILENAME);
}

foreach($langs as $lang => $files) {
	$output = '';

	foreach($files as $file) {
		$output .= '; ' . $file . PHP_EOL;
	}

	$output .= $lang . ' = "' . $lang . '"' . PHP_EOL . PHP_EOL;

	if(!file_exists(FILENAME)) {
		mkdir(FILENAME, 0755, true);
	}

  file_put_contents($xx, $output, FILE_APPEND);
}

?>

<h1>YES</h1>
