<?php

namespace Engine;

use Engine\Database\Database;

class Engine {
	public static function start() {
		if(Define::SHOW_ERRORS) {
			ini_set('display_errors', '1');
			ini_set('display_startup_errors', '1');
			error_reporting(E_ALL);
		}

		class_alias('\\Engine\\Engine', 'Engine');
		class_alias('\\Engine\\Define', 'Define');
		class_alias('\\Engine\\Path', 'Path');
		class_alias('\\Engine\\Request', 'Request');
		class_alias('\\Engine\\Config', 'Config');
		class_alias('\\Engine\\Database\\Database', 'Database');
		class_alias('\\Engine\\Database\\Statement', 'Statement');
		class_alias('\\Engine\\Setting', 'Setting');
		class_alias('\\Engine\\Session', 'Session');
		class_alias('\\Engine\\Auth', 'Auth');
		class_alias('\\Engine\\Module', 'Module');
		class_alias('\\Engine\\Router', 'Router');
		class_alias('\\Engine\\Controller', 'Controller');
		class_alias('\\Engine\\Language', 'Language');
		class_alias('\\Engine\\View', 'View');
		class_alias('\\Engine\\Form', 'Form');
		class_alias('\\Engine\\Theme\\Asset', 'Asset');
		class_alias('\\Engine\\Theme\\Theme', 'Theme');
		class_alias('\\Engine\\Theme\\Template', 'Template');
		class_alias('\\Engine\\Theme\\Meta', 'Meta');
		class_alias('\\Engine\\Theme\\Menu', 'Menu');
		class_alias('\\Engine\\Theme\\Breadcrumb', 'Breadcrumb');
		class_alias('\\Engine\\Theme\\Pagination', 'Pagination');
		class_alias('\\Engine\\Server', 'Server');
		class_alias('\\Engine\\Hash', 'Hash');
		class_alias('\\Engine\\Hook', 'Hook');
		class_alias('\\Engine\\Mail', 'Mail');
		class_alias('\\Engine\\Upload', 'Upload');
		class_alias('\\Engine\\Notification', 'Notification');
		class_alias('\\Engine\\Sitemap', 'Sitemap');

		Session::initialize();
		Request::initialize();
		Config::initialize();
		Database::initialize();
		Setting::initialize();
		Auth::initialize();
		Module::initialize();
		Router::initialize();
	}

	public static function stop() {
		Database::finalize();
	}
}
