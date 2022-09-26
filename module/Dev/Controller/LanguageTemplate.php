<?php

namespace Module\Dev\Controller;

use Engine\Path;

class LanguageTemplate extends \Engine\Controller {
	private $template = '';
	private $translations = [];

	public function __construct() {
		parent::__construct();
	}

	public function generate($module = null) {
		$module = $module ?? $this->module['name'];

		$engine_files = Path::file('engine') . '/*.php';
		$module_files = Path::file('module') . '/' . $module . '/*.php';
		if($module === 'Public') {
			$theme_files = Path::file('theme') . '/*.php';
		}

		$this->getMatches(glob_recursive($engine_files));
		$this->getMatches(glob_recursive($module_files));
		if($module === 'Public') {
			$this->getMatches(glob_recursive($theme_files));
		}

		$this->generateTemplate();
		$this->formatTemplate();

		return $this->template;
	}

	private function getMatches($files) {
		if(empty($files)) {
			return false;
		}

		foreach($files as $file) {
			$content = file_get_contents($file);

			$matches_count = preg_match_all('/\_\_\((.*?)\)/s', $content, $matches);

			if(!$matches_count) {
				continue;
			}

			foreach($matches[1] as $match) {
				$key = str_replace("'", "", $match);

				if(isset($this->translations[$key]) && in_array($file, $this->translations[$key])) {
					continue;
				}

				$this->translations[$key][] = $file;
			}
		}

		return true;
	}

	private function generateTemplate() {
		if(empty($this->translations)) {
			return false;
		}

		ksort($this->translations, SORT_NATURAL | SORT_FLAG_CASE);

		foreach($this->translations as $key => $files) {
			foreach($files as $file) {
				$this->template .= '; ' . str_replace(ROOT_DIR, '', $file) . PHP_EOL;
			}

			$this->template .= $key . ' = "' . $key . '"' . PHP_EOL . PHP_EOL;
		}

		return true;
	}

	private function formatTemplate() {
		if(empty($this->template)) {
			return false;
		}

		$this->template = preg_replace('/;\s+\/engine\/functions\.php\s+\$key\s+\=\s+\"\$key\"\s+/mi', '', $this->template);

		$database_replacement = '; /engine/Database/Statement.php' . PHP_EOL;
		$database_replacement .= 'duplicate:setting.name = "This setting name is alreary exists"' . PHP_EOL;
		$database_replacement .= 'duplicate:user.login = "This login is alreary taken"' . PHP_EOL;
		$database_replacement .= 'duplicate:user.email = "This email is alreary taken"' . PHP_EOL;
		$database_replacement .= 'duplicate:user.phone = "This phone is alreary taken"' . PHP_EOL;
		$database_replacement .= 'duplicate:user.auth_token = "Unknown error. Try again"' . PHP_EOL;
		$database_replacement .= 'duplicate:group.name = "This name is alreary exists"' . PHP_EOL;
		$database_replacement .= 'duplicate:tag.language_name_url = "This tag is alreary exists"' . PHP_EOL;
		$database_replacement .= 'duplicate:custom_field.page_id_language_name = "This custom field is alreary exists"' . PHP_EOL;
		$database_replacement .= 'duplicate:menu.name = "This name is alreary exists"' . PHP_EOL;
		$database_replacement .= 'duplicate:page.url = "This URL slug is alreary taken"' . PHP_EOL . PHP_EOL;

		$database_replacement .= '; /engine/functions.php' . PHP_EOL;
		$database_replacement .= 'day_nominative = "day"' . PHP_EOL;
		$database_replacement .= 'day_plural = "days"' . PHP_EOL;
		$database_replacement .= 'day_singular = "day"' . PHP_EOL;
		$database_replacement .= 'hour_nominative = "hour"' . PHP_EOL;
		$database_replacement .= 'hour_plural = "hours"' . PHP_EOL;
		$database_replacement .= 'hour_singular = "hour"' . PHP_EOL;
		$database_replacement .= 'minute_nominative = "minute"' . PHP_EOL;
		$database_replacement .= 'minute_plural = "minutes"' . PHP_EOL;
		$database_replacement .= 'minute_singular = "minute"' . PHP_EOL;
		$database_replacement .= 'month_nominative = "month"' . PHP_EOL;
		$database_replacement .= 'month_plural = "months"' . PHP_EOL;
		$database_replacement .= 'month_singular = "day"' . PHP_EOL . PHP_EOL;

		$this->template = preg_replace('/;\s+\/engine\/Database\/Statement\.php\s+\$error_message\s+=\s+\"\$error_message\"\s+/mi', $database_replacement, $this->template);

		return true;
	}
}
