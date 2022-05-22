<?php

namespace Module\Dev\Controller;

use Engine\Module;
use Engine\Request;
use Engine\Server;

class LanguageTemplate extends \Engine\Controller {
	private $module_name;
	private $module_dir;
	private $language_dir;
	private $language_file;

	private $engine_dir;
	private $theme_dir;

	private $module_files = [];
	private $engine_files = [];
	private $theme_files = [];

	private $translations = [];

	public function __construct() {
		parent::__construct();

		$this->module_name = filter_var($this->route['parameters']['module_name'], FILTER_SANITIZE_STRING) ?? null;
		$this->module_dir = ROOT_DIR . '/module/' . $this->module_name;
		$this->language_dir = $this->module_dir . '/Language';
		$this->language_file = $this->language_dir . '/lang@lang_REGION@LangName.ini';

		$this->engine_dir = ROOT_DIR . '/engine';
		$this->theme_dir = ROOT_DIR . '/theme';
	}

	public function generate() {
		if(!$this->module_name) {
			Server::answer(null, 'error', 'Enter module name');
		}

		if(!array_key_exists($this->module_name, Module::getAll())) {
			Server::answer(null, 'error', 'There is not ' . $this->module_name . ' module');
		}

		$this->engine_files = glob_recursive($this->engine_dir . '/*.php');
		$this->theme_files = glob_recursive($this->theme_dir . '/*.php');
		$this->module_files = glob_recursive($this->module_dir . '/*.php');

		$this->findMatches();
		$this->saveTemplateFile();

		Server::answer(null, 'success', str_replace(ROOT_DIR, Request::$base, $this->language_file));
	}

	private function findMatches() {
		$files = array_merge($this->engine_files, $this->module_files, $this->theme_files);

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
		if(!file_exists($this->language_dir)) {
			mkdir($this->language_dir, 0755, true);
		}

		if(is_file($this->language_file)) {
			unlink($this->language_file);
		}

		foreach($this->translations as $key => $files) {
			$output = '';

			foreach($files as $file) {
				$output .= '; ' . str_replace(ROOT_DIR, Request::$base, $file) . PHP_EOL;
			}

			$output .= $key . ' = "' . $key . '"' . PHP_EOL . PHP_EOL;

			file_put_contents($this->language_file, $output, FILE_APPEND);
		}

		return true;
	}
}
