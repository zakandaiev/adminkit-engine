<?php

############################# PHP 8 #############################
if(!function_exists('str_contains')) {
	function str_contains(string $haystack, string $needle):bool {
		return '' === $needle || false !== strpos($haystack, $needle);
	}
}

if(!function_exists('str_starts_with')) {
	function str_starts_with($haystack, $needle) {
		$length = strlen($needle);
		return substr($haystack, 0, $length) === $needle;
	}
}

############################# DEBUG #############################
function debug($obj) {
	echo '<pre>';
	var_dump($obj);
	echo '</pre>';
}

function debug_trace($level = null) {
	debug($level ? (isset(debug_backtrace()[$level]) ? debug_backtrace()[$level] : debug_backtrace()) : debug_backtrace());
}

############################# FILE #############################
function file_name($path) {
	return pathinfo($path, PATHINFO_FILENAME);
}

function file_extension($path) {
	return pathinfo($path, PATHINFO_EXTENSION);
}

function file_size($path, $precision = 2) {
	$size = 0;

	if(is_file($path)) {
		$size = filesize($path);
	} else {
		foreach(glob_recursive($path . '/*.*') as $file) {
			$size += filesize($file);
		}
	}

	$units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	for($i = 0; $size > 1024; $i++) $size /= 1024;

	return round($size, 2) . ' ' . $units[$i];
}

function glob_recursive($pattern, $flags = 0) {
	$files = glob($pattern, $flags);

	foreach(glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
		$files = array_merge($files, glob_recursive($dir . '/' . basename($pattern), $flags));
	}

	return $files;
}

function rmdir_recursive($path) {
	if(is_dir($path)) {
		$files = array_diff(scandir($path), array('.', '..'));

		foreach($files as $file) {
			rmdir_recursive(realpath($path) . '/' . $file);
		}

		return rmdir($path);
	}
	else if(is_file($path)) {
		return unlink($path);
	}

	return false;
}

############################# IMAGE #############################
function svg($file, $is_asset = true) {
	$dir = $is_asset ? (Path::file('asset') . '/img') : ROOT_DIR;
	$file_name = str_ireplace('.svg', '', trim($file ?? '', '/'));
	$path_to_svg = $dir . '/' . $file_name . '.svg';

	if(!is_file($path_to_svg)) {
		return '<!-- SVG not found: ' . $path_to_svg .' -->';
	} else {
		return file_get_contents($path_to_svg);
	}
}

function images($json, $attributes = '') {
	$output = '';
	$images = json_decode($json) ?? [];

	foreach($images as $image) {
		$output .= '<img src="' . Request::$base . '/' . $image . '" ' . $attributes . '>';
	}

	return $output;
}

function placeholder_image($path) {
	if(is_file(ROOT_DIR . '/' . $path)) {
		return $path;
	}

	return site(__FUNCTION__);
}

function placeholder_avatar($path) {
	if(is_file(ROOT_DIR . '/' . $path)) {
		return $path;
	}

	return site(__FUNCTION__);
}

############################# DATE #############################
function format_date($date = null, $format = null) {
	$timestamp = $date ?? time();
	$timestamp = is_numeric($timestamp) ? $timestamp : strtotime($timestamp);
	return isset($format) ? date($format, $timestamp) : date('d.m.Y', $timestamp) . ' ' . __('at') . ' ' . date('H:i', $timestamp);
}

function format_date_input($date = null) {
	return format_date($date, 'Y-m-d') . 'T' . format_date($date, 'H:i:s');
}

function date_when($date, $format = null) {
	$fmt = $format ?? 'd.m.Y';
	$timestamp = is_numeric($date) ? $date : strtotime($date ?? time());

	$getdata = date('d.m.Y', $timestamp);
	$yesterday = date('d.m.Y', mktime(0, 0, 0, date('m'), date('d') - 1, date('Y')));

	if($getdata === date('d.m.Y')) {
		$date = __('Today at') . ' ' . date('H:i', $timestamp);
	} else {
		if($yesterday === $getdata) {
			$date = __('Yesterday at') . ' ' . date('H:i', $timestamp);
		} else {
			$date = format_date($timestamp, $format);
		}
	}

	return $date;
}

function decl_of_num($number, $titles) {
	$cases = array(2, 0, 1, 1, 1, 2);
	return $number . ' ' . $titles[4 < $number % 100 && $number % 100 < 20 ? 2 : $cases[min($number % 10, 5)]];
}

function date_left($date) {
	$now = time();
	$then = is_numeric($date) ? $date : strtotime($date ?? time());

	if($then - $now < 0) {
		return __('The term has expired');
	}

	$difference = abs($then - $now);
	$left = [];

	$month = floor($difference / 2592000);
	if(0 < $month) {
		$left['month'] = decl_of_num($month, array(__('month_nominative'), __('month_singular'), __('month_plural')));
	}

	$days = floor($difference / 86400) % 30;
	if(0 < $days) {
		$left['days'] = decl_of_num($days, array(__('day_nominative'), __('day_singular'), __('day_plural')));
	}

	$hours = floor($difference / 3600) % 24;
	if(0 < $hours) {
		$left['hours'] = decl_of_num($hours, array(__('hour_nominative'), __('hour_singular'), __('hour_plural')));
	}

	$minutes = floor($difference / 60) % 60;
	if(0 < $minutes) {
		$left['minutes'] = decl_of_num($minutes, array(__('minute_nominative'), __('minute_singular'), __('minute_plural')));
	}

	if(0 < count($left)) {
		$datediff = implode(' ', $left);
		return $datediff;
	}

	return __('A few seconds');
}

############################# TEXT #############################
function html($text = ''){
	return htmlspecialchars($text ?? '');
}

function url($url = '') {
	return urlencode($url ?? '');
}

function tel($tel = '') {
	return preg_replace('/[^\d+]+/m', '', $tel ?? '');
}

function cyr_to_lat($text) {
	$gost = [
		'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd',
		'е' => 'e', 'ё' => 'e', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
		'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n',
		'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
		'у' => 'u', 'ф' => 'f', 'х' => 'kh', 'ц' => 'tz', 'ч' => 'ch',
		'ш' => 'sh', 'щ' => 'sch', 'ы' => 'y', 'э' => 'e', 'ю' => 'iu',
		'я' => 'ia',
		'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D',
		'Е' => 'E', 'Ё' => 'E', 'Ж' => 'Zh', 'З' => 'Z', 'И' => 'I',
		'Й' => 'Y', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N',
		'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
		'У' => 'U', 'Ф' => 'F', 'Х' => 'Kh', 'Ц' => 'Tz', 'Ч' => 'Ch',
		'Ш' => 'Sh', 'Щ' => 'Sch', 'Ы' => 'Y', 'Э' => 'E', 'Ю' => 'Iu',
		'Я' => 'Ia',
		'ь' => '', 'Ь' => '', 'ъ' => '', 'Ъ' => '',
		'ї' => 'yi',
		'і' => 'i',
		'ґ' => 'g',
		'є' => 'e',
		'Ї' => 'Yi',
		'І' => 'I',
		'Ґ' => 'G',
		'Є' => 'E'
	];

	return strtr($text, $gost);
}

function slug($text, $delimiter = '-') {
	$slug = cyr_to_lat($text);
	$slug = preg_replace('/[^A-Za-z0-9' . $delimiter . ']+/', $delimiter, $slug);
	$slug = preg_replace('/[' . $delimiter . ']+/', $delimiter, $slug);
	$slug = trim($slug ?? '', $delimiter);
	$slug = strtolower($slug ?? '');

	return $slug;
}

function word($text) {
	$word = preg_replace('/[^\p{L}\d ]+/iu', '', $text);
	$word = preg_replace('/[\s]+/', ' ', $word);
	$word = trim($word ?? '');

	return $word;
}

function excerpt($text, $maxchar, $end = "...") {
	if(strlen($text ?? '') > $maxchar) {
		$words = preg_split('/\s/', $text);
		$output = '';
		$i = 0;
		while(1) {
			$length = strlen($output)+strlen($words[$i]);
			if($length > $maxchar) {
				break;
			}
			else {
				$output .= ' ' . $words[$i];
				++$i;
			}
		}
		$output .= $end;
	}
	else {
		$output = $text;
	}
	return $output;
}

############################# LANGUAGE #############################
function __($key) {
	return Language::translate($key);
}

function lang($lang, $key, $mixed = null) {
	$value = '';

	switch(strval($key)) {
		case 'region': {
			$value = Language::get('region', $lang) ?? '';
			break;
		}
		case 'name': {
			$value = Language::get('name', $lang) ?? '';
			break;
		}
		case 'icon': {
			$value = 'img/flag/' . $lang . '.' . ($mixed ?? 'png');
			break;
		}
	}

	return $value;
}

############################# SITE #############################
function site($key) {
	$value = null;

	foreach(Setting::getAll() as $setting) {
		if(isset($setting->{$key})) {
			$value = $setting->{$key};

			if($value === 'true') {
				$value = true;
			}
			if($value === 'false') {
				$value = false;
			}
			if(is_string($value) && $value[0] === "[") {
				$value = json_decode($value) ?? [];
			}

			return $value;
		}
	}

	switch(strval($key)) {
		case 'name': {
			$value = $value ?? Engine::NAME;
			break;
		}
		case 'charset': {
			$value = preg_replace('/([a-z]+)-?/i', '$1-', DATABASE['charset'] ?? '');
			$value = rtrim($value, '-');
			break;
		}
		case 'language_current': {
			$value = Language::current();
			break;
		}
		case 'url': {
			$value = Request::$base;
			break;
		}
		case 'url_language': {
			$value = Request::$base;

			if(site('language') !== site('language_current')) {
				$value .= '/' . site('language_current');
			}

			break;
		}
		case 'uri_cut_language': {
			$uri = trim(Request::$uri ?? '', '/');
			$uri_parts = explode('/', $uri);

			if(Language::has($uri_parts[0])) {
				array_shift($uri_parts);
				$uri = implode('/', $uri_parts);
			}

			$value = '/' . $uri;

			break;
		}
		case 'languages': {
			$value = Language::list();
			break;
		}
		case 'permalink': {
			$value = trim(strtok(Request::$url ?? '', '?'), '/');
			break;
		}
		case 'version': {
			$value = Engine::VERSION;
			break;
		}
	}

	return $value;
}

############################# HELPERS #############################
function is_closure($i) {
	return $i instanceof \Closure;
}

function is_route_active($route) {
	$uri = trim(strtok(site('uri_cut_language'), '?'), '/');

	if(is_array($route)) {
		$route = array_map(function($r) {
			return trim($r ?? '', '/');
		}, $route);

		if(is_array($route) && in_array($uri, $route)) {
			return true;
		}
	} else {
		$route = trim($route ?? '', '/');

		if($route === $uri) {
			return true;
		}
	}

	return false;
}

function filter_link($key, $value, $text) {
	$link = site('permalink') . '?' . $key . '=' . urlencode($value);

	foreach(Request::$get as $get_key => $get_value) {
		if($get_key === $key) continue;
		$link .= '&' . $get_key . '=' . urlencode($get_value);
	}

	return '<a href="' . $link . '">' . $text . '</a>';
}

function sort_link($key, $text) {
	$sort = (Request::get($key) === 'desc') ? 'asc' : 'desc';

	$link = site('permalink') . '?' . $key . '=' . $sort;

	if(Request::has('back')) {
		$link .= '&back=' . urlencode(Request::get('back'));
	}

	return '<a href="' . $link . '">' . $text . '</a>';
}

function numerical_noun_form($number) {
	// return 'n' - nominative (комментарий)
	// return 'p' - plural (комментариев)
	// return 's' - singular (комментария)

	$number = intval($number);

	if($number > 10 && (($number % 100) / 10) == 1) {
		return 'p';
	}

	switch($number % 10) {
		case 1: return 'n';
		case 2: case 3: case 4: return 's';
	}

	return 'p';
}

function translator_noun_form($number, $prefix) {
	switch(numerical_noun_form($number)) {
		case 'n': return __("{$prefix}_nominative");
		case 'p': return __("{$prefix}_plural");
		case 's': return __("{$prefix}_singular");
	}
}

function is_num_in_range($number, $min, $max) {
	if($number >= $min && $number < $max) {
		return true;
	}

	return false;
}
