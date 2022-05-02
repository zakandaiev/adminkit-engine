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

############################# FILE #############################
function file_name($path) {
	return pathinfo($path, PATHINFO_FILENAME);
}

function file_extension($path) {
	return pathinfo($path, PATHINFO_EXTENSION);
}

############################# IMAGE #############################
function svg($file) {
	$path = Path::file('asset') . '/img/' . trim($file, '/') . '.svg';

	if(!file_exists($path)) {
		return null;
	} else {
		return file_get_contents($file);
	}
}

function images(array $json, $attributes = '') {
	$output = '';
	$images = json_decode($json);

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

############################# FORMAT #############################
function format_date($date = null, $format = null) {
	$fmt = $format ?? 'd.m.Y H:i';
	$timestamp = $date ?? time();
	$timestamp = is_numeric($timestamp) ? $timestamp : strtotime($timestamp);
	return date($fmt, $timestamp);
}

function format_date_input($date = null) {
	return format_date($date, 'Y-m-d') . 'T' . format_date($date, 'H:i:s');
}

function date_when($date, $format = null) {
	$fmt = $format ?? 'd.m.Y';
	$timestamp = is_numeric($date) ? $date : strtotime($date);

	$getdata = date('d.m.Y', $timestamp);
	$yesterday = date('d.m.Y', mktime(0, 0, 0, date('m'), date('d') - 1, date('Y')));

	if($getdata === date('d.m.Y')) {
		$date = __('Today at') . ' ' . date('H:i', $timestamp);
	} else {
		if($yesterday === $getdata) {
			$date = __('Yesterday at') . ' ' . date('H:i', $timestamp);
		} else {
			$date = date($fmt, $timestamp);
		}
	}

	return $date;
}

############################# TIMEZONE #############################
function get_time_zones() {
	$regions = array(
		'Africa' => DateTimeZone::AFRICA,
		'America' => DateTimeZone::AMERICA,
		'Antarctica' => DateTimeZone::ANTARCTICA,
		'Asia' => DateTimeZone::ASIA,
		'Atlantic' => DateTimeZone::ATLANTIC,
		'Europe' => DateTimeZone::EUROPE,
		'Indian' => DateTimeZone::INDIAN,
		'Pacific' => DateTimeZone::PACIFIC
	);

	$timezones = array();

	foreach($regions as $name => $mask) {
		$zones = DateTimeZone::listIdentifiers($mask);

		foreach($zones as $timezone) {
			$time = new DateTime(NULL, new DateTimeZone($timezone));

			$timezones[$name][$timezone] = substr($timezone, strlen($name) + 1) . ' - ' . $time->format('H:i');
		}
	}

	return $timezones;
}

function print_time_zones($selected = '') {
	foreach(get_time_zones() as $region => $list) {

		echo '<optgroup label="' . $region . '">';

		foreach($list as $timezone => $name) {
			$selected_status = '';
		
			if($timezone === $selected) {
				$selected_status = 'selected';
			}
			
			echo '<option value="' . $timezone . '" ' . $selected_status . '>' . $name . '</option>';
		}

		echo '</optgroup>';
	}
}

############################# HTML #############################
function hc($text){
	return htmlspecialchars($text);
}

function us($url) {
	return str_replace(' ', '%20', $url);
}

############################# TEXT #############################
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

function slug($text) {
	$slug = cyr_to_lat($text);
	$slug = preg_replace('/[^A-Za-z0-9-]+/', '-', $slug);
	$slug = preg_replace('/[\-]+/', '-', $slug);
	$slug = trim($slug, '-');
	$slug = strtolower($slug);

	return $slug;
}

function keyword($text) {
	$keyword = cyr_to_lat($text);
	$keyword = preg_replace('/[^A-Za-z_]+/', '_', $keyword);
	$keyword = preg_replace('/[_]+/', '_', $keyword);
	$keyword = trim($keyword, '_');
	$keyword = strtolower($keyword);

	return $keyword;
}

function word($text) {
	$word = preg_replace('/[^\p{L}\d ]+/iu', '', $text);
	$word = preg_replace('/[\s]+/', ' ', $word);
	$word = trim($word);

	return $word;
}

############################# LANGUAGE #############################
function __($key) {
	return Language::translate($key) ?? $key;
}

function lang($lang, $key) {
	$value = null;

	switch(strval($key)) {
		case 'region': {
			$value = Module::get('languages')[$lang]['region'] ?? null;
			break;
		}
		case 'name': {
			$value = Module::get('languages')[$lang]['name'] ?? null;
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

			if($value == 'true') {
				$value = true;
			}
			if($value == 'false') {
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
			$value = $value ?? Define::NAME;
			break;
		}
		case 'charset': {
			$value = Config::get('database')['charset'];
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
	}

	return $value;
}
