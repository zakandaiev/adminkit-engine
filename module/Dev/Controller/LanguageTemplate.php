<?php

namespace Module\Dev\Controller;

use Engine\Module;
use Engine\Path;
use Engine\Request;
use Engine\Server;

class LanguageTemplate extends \Engine\Controller {
	private $modules_dir;
	private $languages_dir;
	private $engine_dir;
	private $theme_dir;

	private $modules_files = [];
	private $engine_files = [];
	private $theme_files = [];

	private $translations = [];

	private $template_name;

	public function __construct() {
		parent::__construct();

		$this->modules_dir = Path::file('module');
		$this->languages_dir = Path::file('language');
		$this->engine_dir = Path::file('engine');
		$this->theme_dir = Path::file('theme');

		$this->template_name = $this->languages_dir . '/lang@REGION@LangName.ini';
	}

	public function generate() {
		$this->engine_files = glob_recursive($this->engine_dir . '/*.php');
		$this->theme_files = glob_recursive($this->theme_dir . '/*.php');
		$this->modules_files = glob_recursive($this->modules_dir . '/*.php');

		$this->findMatches();
		$this->saveTemplateFile();

		Server::answer(null, 'success', str_replace(ROOT_DIR, Request::$base, $this->template_name));
	}

	private function findMatches() {
		$files = array_merge($this->engine_files, $this->modules_files, $this->theme_files);

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

	private function saveTemplateFile() {
		if(!file_exists($this->languages_dir)) {
			mkdir($this->languages_dir, 0755, true);
		}

		if(is_file($this->template_name)) {
			unlink($this->template_name);
		}

		ksort($this->translations, SORT_NATURAL | SORT_FLAG_CASE);

		foreach($this->translations as $key => $files) {
			$output = '';

			foreach($files as $file) {
				$output .= '; ' . str_replace(ROOT_DIR, Request::$base, $file) . PHP_EOL;
			}

			$output .= $key . ' = "' . $key . '"' . PHP_EOL . PHP_EOL;

			file_put_contents($this->template_name, $output, FILE_APPEND);
		}

		return true;
	}
}
