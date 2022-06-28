<?php

namespace Module\Dev\Controller;

use Engine\Module;
use Engine\Path;
use Engine\Request;
use Engine\Server;

class LanguageTemplate extends \Engine\Controller {
	private $engine_dir;
	private $theme_dir;
	private $modules_dir;
	private $languages_dir;

	private $template_path;

	public function __construct() {
		parent::__construct();

		$this->engine_dir = Path::file('engine');
		$this->theme_dir = Path::file('theme');
		$this->modules_dir = Path::file('module');
		$this->languages_dir = Path::file('language');

		$this->template_path = $this->languages_dir . '/lang@REGION@LangName.ini';
	}

	public function generate() {
		$this->createTemplateFile();

		$this->saveTemplateFile('Engine', $this->getMatches(glob_recursive($this->engine_dir . '/*.php')));
		$this->saveTemplateFile('Theme', $this->getMatches(glob_recursive($this->theme_dir . '/*.php')));

		foreach(Module::getAll() as $module) {
			if(!$module['is_enabled']) continue;

			$section = 'Module: ' . $module['name'];
			$path = $this->modules_dir . '/' . $module['name'] . '/*.php';

			$this->saveTemplateFile($section, $this->getMatches(glob_recursive($path)));
		}

		Server::answer(null, 'success', str_replace(ROOT_DIR, Request::$base, $this->template_path));
	}

	public function generateModule() {
		$module = Module::getSelf($this->route['parameters']['name']);

		if(empty($module)) {
			Module::setName('Admin');
			$this->view->error('404');
		}

		$this->languages_dir = Path::file('module') . '/' . $module['name'] . '/Install/Language';
		$this->template_path = $this->languages_dir . '/lang@REGION@LangName.ini';

		$this->createTemplateFile();

		$section = 'Module: ' . $module['name'];
		$path = $this->modules_dir . '/' . $module['name'] . '/*.php';

		$this->saveTemplateFile($section, $this->getMatches(glob_recursive($path)), true);

		Server::answer(null, 'success', str_replace(ROOT_DIR, Request::$base, $this->template_path));
	}

	private function getMatches($files) {
		$translations = [];

		if(empty($files)) {
			return $translations;
		}

		foreach($files as $file) {
			$content = file_get_contents($file);

			$matches_count = preg_match_all('/\_\_\((.*?)\)/s', $content, $matches);

			if(!$matches_count) {
				continue;
			}

			foreach($matches[1] as $match) {
				$key = str_replace("'", "", $match);

				if(isset($translations[$key]) && in_array($file, $translations[$key])) {
					continue;
				}

				$translations[$key][] = $file;
			}
		}

		return $translations;
	}

	private function createTemplateFile() {
		if(!file_exists($this->languages_dir)) {
			mkdir($this->languages_dir, 0755, true);
		}

		if(is_file($this->template_path)) {
			unlink($this->template_path);
		}

		file_put_contents($this->template_path, '');

		return true;
	}

	private function saveTemplateFile($section, $translations, $force_no_section = false) {
		if(empty($section) || empty($translations)) {
			return false;
		}

		$output = '# BEGIN ' . $section . PHP_EOL . PHP_EOL;
		if($force_no_section) $output = '';

		ksort($translations, SORT_NATURAL | SORT_FLAG_CASE);

		foreach($translations as $key => $files) {
			foreach($files as $file) {
				$output .= '; ' . str_replace(ROOT_DIR, Request::$base, $file) . PHP_EOL;
			}

			$output .= $key . ' = "' . $key . '"' . PHP_EOL . PHP_EOL;
		}

		if(!$force_no_section) $output .= '# END ' . $section . PHP_EOL . PHP_EOL;

		file_put_contents($this->template_path, $output, FILE_APPEND);

		return true;
	}
}
