<?php

define('LOG', [
	'folder' => 'log',
	'file_mask' => 'Y-m-d',
	'extension' => 'log'
]);
define('COOKIE_KEY', ['auth' => 'auth_token']);
define('LIFETIME', ['auth' => 3600 * 24 * 7]);

use \Engine\Engine;
use \Engine\Hash;
use \Engine\Log;
use \Engine\Session;

Session::initialize();

storePostData();

$step = 'db';
$step_next = 'site';

if(isset($_GET['step']) && $_GET['step'] == 'site') {
	$step = 'site';
	$step_next = 'auth';
}
if(isset($_GET['step']) && $_GET['step'] == 'auth') {
	$step = 'auth';
	$step_next = 'demo';
}
if(isset($_GET['step']) && $_GET['step'] == 'demo') {
	$step = 'demo';
	$step_next = 'install';
}
if(isset($_GET['step']) && $_GET['step'] == 'install') {
	$step = 'install';
}

if($step == 'install' && install()) {
	Session::flush();
	header('Location: /admin');
}

function tableExists($connection, $table) {
	try {
		$result = $connection->query("SELECT 1 FROM $table LIMIT 1");
	} catch(Exception $e) {
		return FALSE;
	}
	return $result !== FALSE;
}

function install() {
	$data = Session::getAll();

	// FOLDERS
	if(!file_exists(ROOT_DIR . '/theme')) {
		mkdir(ROOT_DIR . '/theme', 0755, true);
	}
	if(!file_exists(ROOT_DIR . '/upload')) {
		mkdir(ROOT_DIR . '/upload', 0755, true);
	}

	installConfig($data);
	installSEO($data);

	// INSTALL PROCESS
	$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $data['db_host'], $data['db_name'], $data['db_charset']);

	$options = [
		PDO::ATTR_PERSISTENT => true,
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . $data['db_charset']
	];

	$connection = new PDO($dsn, $data['db_user'], $data['db_pass'], $options);

	$install_file = file_get_contents(ROOT_DIR . '/module/Install/Engine/engine.sql');
	executeSQL($data, $connection, $install_file);

	// DEMO DATA
	if(isset($data['demo_data']) && $data['demo_data'] === 'on') {
		$demo_file = file_get_contents(ROOT_DIR . '/module/Install/Engine/demo/demo.sql');
		executeSQL($data, $connection, $demo_file);

		if(file_exists(ROOT_DIR . '/upload/demo')) {
			unlink(ROOT_DIR . '/upload/demo');
		} else {
			mkdir(ROOT_DIR . '/upload/demo', 0755, true);
		}

		foreach(glob_recursive(ROOT_DIR . '/module/Install/Engine/demo/theme/*.*') as $file) {
			$dest_folder = str_replace('/module/Install/Engine/demo', '', $file);
			$dest_folder = str_replace('/' . file_name($file) . '.' . file_extension($file), '', $dest_folder);

			if(!file_exists($dest_folder)) {
				mkdir($dest_folder, 0755, true);
			}

			copy($file, $dest_folder . '/' . file_name($file) . '.' . file_extension($file));
		}

		foreach(glob(ROOT_DIR . '/module/Install/Engine/demo/upload/*.*') as $file) {
			copy($file, ROOT_DIR . '/upload/demo/' . file_name($file) . '.' . file_extension($file));
		}
	}

	Log::write('Engine has been installed successfully');

	return true;
}

function executeSQL($data, $connection, $sql) {
	$replace_from = [
		'%prefix%',
		'%site_name%', '%contact_email%',
		'%admin_login%', '%admin_password%', '%admin_email%',
		'%auth_token%', '%auth_ip%'
	];
	$replace_to = [
		$data['db_prefix'],
		$data['site_name'], $data['contact_email'],
		$data['admin_login'], Hash::password($data['admin_password']), $data['admin_email'],
		generateAuthToken(), filter_var($_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP)
	];

	$sql_formatted = str_replace($replace_from, $replace_to, $sql);

	$connection->query($sql_formatted);
}

function storePostData() {
	foreach($_POST as $key => $value) {
		${$key} = $value;
		Session::set($key, $value);
	}
}

function generateAuthToken() {
	$auth_key = COOKIE_KEY['auth'];
	$auth_token = Session::hasCookie($auth_key) ? Session::getCookie($auth_key) : Hash::token();

	Session::setCookie($auth_key, $auth_token);

	return $auth_token;
}

function installConfig($data) {
	$path = ROOT_DIR . '/config.php';

	// CONFIG START
	$config  = "<?php" . PHP_EOL . PHP_EOL;

	// DATABASE
	$config .= "define('DATABASE', [" . PHP_EOL;
	$config .= "\t'host' => '{$data['db_host']}'," . PHP_EOL;
	$config .= "\t'name' => '{$data['db_name']}'," . PHP_EOL;
	$config .= "\t'username' => '{$data['db_user']}'," . PHP_EOL;
	$config .= "\t'password' => '{$data['db_pass']}'," . PHP_EOL;
	$config .= "\t'charset' => '{$data['db_charset']}'," . PHP_EOL;
	$config .= "\t'prefix' => '{$data['db_prefix']}'," . PHP_EOL;
	$config .= "\t'options' => [" . PHP_EOL;
	$config .= "\t\tPDO::ATTR_PERSISTENT => true," . PHP_EOL;
	$config .= "\t\tPDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION," . PHP_EOL;
	$config .= "\t\tPDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES {$data['db_charset']}'" . PHP_EOL;
	$config .= "\t]" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// DEBUG
	$config .= "define('DEBUG', [" . PHP_EOL;
	$config .= "\t'is_enabled' => true," . PHP_EOL;
	$config .= "\t'lang_wrap' => '_'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// CACHE
	$config .= "define('CACHE', [" . PHP_EOL;
	$config .= "\t'folder' => 'cache'," . PHP_EOL;
	$config .= "\t'extension' => 'bin'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// LOG
	$config .= "define('LOG', [" . PHP_EOL;
	$config .= "\t'folder' => 'log'," . PHP_EOL;
	$config .= "\t'file_mask' => 'Y-m-d'," . PHP_EOL;
	$config .= "\t'extension' => 'log'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// COOKIE_KEY
	$config .= "define('COOKIE_KEY', [" . PHP_EOL;
	$config .= "\t'auth' => 'auth_token'," . PHP_EOL;
	$config .= "\t'csrf' => 'csrf_token'," . PHP_EOL;
	$config .= "\t'language' => 'language'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// LIFETIME
	$config .= "define('LIFETIME', [" . PHP_EOL;
	$config .= "\t'auth' => 3600 * 24 * 7, // 7 days" . PHP_EOL;
	$config .= "\t'cache' => 3600, // 1 hour" . PHP_EOL;
	$config .= "\t'form' => 3600 * 12 // 12 hours" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// PAGINATION
	$config .= "define('PAGINATION', [" . PHP_EOL;
	$config .= "\t'uri_key' => 'page'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// SERVICE
	$config .= "define('SERVICE', [" . PHP_EOL;
	$config .= "\t'ip_checker' => 'https://check-host.net/ip-info?host=%s'" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// UPLOAD
	$config .= "define('UPLOAD', [" . PHP_EOL;
	$config .= "\t'folder' => 'upload'," . PHP_EOL;
	$config .= "\t'extensions' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'zip', 'rar']" . PHP_EOL;
	$config .= "]);" . PHP_EOL;
	$config .= PHP_EOL;

	// CONFIG END
	file_put_contents($path, $config, LOCK_EX);

	return true;
}

function installSEO($data) {
	$site_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http').'://'.$_SERVER['HTTP_HOST'];

	// ROBOTS
	$robots_txt = 'User-agent: *' . PHP_EOL;
	$robots_txt .= 'Disallow: /404' . PHP_EOL;
	$robots_txt .= 'Disallow: /admin/' . PHP_EOL . PHP_EOL;
	$robots_txt .= 'Sitemap: ' . $site_url . '/sitemap.xml';
	file_put_contents(ROOT_DIR . '/robots.txt', $robots_txt, LOCK_EX);

	// SITEMAP
	$sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
	$sitemap_xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' . PHP_EOL;
	$sitemap_xml .= '<url><loc>' . $site_url . '</loc><lastmod>' . date('c') . '</lastmod><priority>1.00</priority></url>' . PHP_EOL;
	$sitemap_xml .= '</urlset>';
	file_put_contents(ROOT_DIR . '/sitemap.xml', $sitemap_xml, LOCK_EX);

	return true;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Install</title>

	<link rel="stylesheet" href="/module/Admin/View/Asset/css/adminkit.css">
	<link rel="stylesheet" href="/module/Admin/View/Asset/css/main.css">

	<link rel="icon" type="image/x-icon" sizes="any" href="/module/Admin/View/Asset/favicon.ico">
	<link rel="icon" type="image/png" href="/module/Admin/View/Asset/favicon.png">
	<link rel="icon" type="image/svg+xml" href="/module/Admin/View/Asset/favicon.svg">
	<link rel="apple-touch-icon" href="/module/Admin/View/Asset/favicon.png">
</head>

<body>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<h1 class="h2"><?= Engine::NAME ?></h1>
						<p class="lead">Installing</p>
					</div>

					<div class="card">
						<div class="card-header">
							<h5 class="card-title mb-0">
								<?php if($step == 'site'): ?>
									Site setting up
								<?php elseif($step == 'auth'): ?>
									Administrator authorization setting up
								<?php elseif($step == 'demo'): ?>
									Demo data
								<?php else: ?>
									Database setting up
								<?php endif; ?>
							</h5>
						</div>
						<div class="card-body">
							<form action="/install?step=<?= $step_next ?>" method="POST">
								<?php if($step == 'auth'): ?>
									<div class="mb-3">
										<label class="form-label">Login</label>
										<input class="form-control" type="text" name="admin_login" placeholder="Login" required minlength="2" maxlength="100">
									</div>
									<div class="mb-3">
										<label class="form-label">Password</label>
										<input class="form-control" type="text" name="admin_password" placeholder="Password" required minlength="8" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label">Email</label>
										<input class="form-control" type="email" name="admin_email" placeholder="Email" required minlength="6" maxlength="200">
									</div>
								<?php elseif($step == 'site'): ?>
									<?php
										$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $_POST['db_host'], $_POST['db_name'], $_POST['db_charset']);

										$options = [
											PDO::ATTR_PERSISTENT => true,
											PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
											PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . $_POST['db_charset']
										];

										try {
											$connection = new PDO($dsn, $_POST['db_user'], $_POST['db_pass'], $options);
										} catch(PDOException $e) {
											echo '<h2>Error</h2>';
											echo "<p>Reason: {$e->getMessage()}</p>";
											echo '<a href="/install" class="btn btn-lg btn-primary w-100">Try again</a>';
											exit;
										}

										if(tableExists($connection, $_POST['db_prefix'] . '_setting') == 1) {
											echo '<h2>Error</h2>';
											echo '<p>Remove all tables from DB <b>' . $_POST['db_name'] . '</b> and try again.</p>';
											echo '<a href="/install" class="btn btn-lg btn-primary w-100">Try again</a>';
											exit;
										}
									?>
									<div class="mb-3">
										<label class="form-label">Site name</label>
										<input class="form-control" type="text" name="site_name" placeholder="Site name" required>
									</div>
									<div class="mb-3">
										<label class="form-label">Contact email</label>
										<input class="form-control" type="email" name="contact_email" value="info@<?=$_SERVER['HTTP_HOST']?>" placeholder="Contact email" required>
									</div>
								<?php elseif($step == 'demo'): ?>
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" name="demo_data" id="demo_data">
										<label class="form-check-label" for="demo_data">Fill up with demo data</label>
									</div>
								<?php else: ?>
									<div class="mb-3">
										<label class="form-label">Host</label>
										<input class="form-control" type="text" name="db_host" value="localhost" placeholder="Host" required>
									</div>
									<div class="mb-3">
										<label class="form-label">User</label>
										<input class="form-control" type="text" name="db_user" placeholder="User" required>
									</div>
									<div class="mb-3">
										<label class="form-label">Password</label>
										<input class="form-control" type="text" name="db_pass" placeholder="Password" required>
									</div>
									<div class="mb-3">
										<label class="form-label">Database name</label>
										<input class="form-control" type="text" name="db_name" placeholder="Database name" required>
									</div>
									<div class="mb-3">
										<label class="form-label">Charset</label>
										<input class="form-control" type="text" name="db_charset" value="utf8" placeholder="Charset" required>
									</div>
									<div class="mb-3">
										<label class="form-label">Table prefix</label>
										<input class="form-control" type="text" name="db_prefix" value="pre" placeholder="Table prefix" required>
									</div>
								<?php endif; ?>
								<div class="text-center mt-3">
									<button type="submit" class="btn btn-lg btn-primary w-100">
										<?php if($step == 'site'): ?>
											Next step
										<?php elseif($step == 'auth'): ?>
											Install
										<?php else: ?>
											Next step
										<?php endif; ?>
									</button>
								</div>
							</form>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</main>

</body>

</html>
