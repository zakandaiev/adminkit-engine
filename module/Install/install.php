<?php

use \Engine\Define;

session_start();
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
	session_destroy();
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
	$data = $_SESSION;
	$db_config_path = ROOT_DIR . '/config';
	$site_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http').'://'.$_SERVER['HTTP_HOST'];

	// CONFIG
	$db_config_file  = "<?php" . PHP_EOL . PHP_EOL;
	$db_config_file .= "return [" . PHP_EOL;
	$db_config_file .= "\t'host'\t\t\t=> '{$data['db_host']}'," . PHP_EOL;
	$db_config_file .= "\t'name'\t\t\t=> '{$data['db_name']}'," . PHP_EOL;
	$db_config_file .= "\t'username'\t=> '{$data['db_user']}'," . PHP_EOL;
	$db_config_file .= "\t'password'\t=> '{$data['db_pass']}'," . PHP_EOL;
	$db_config_file .= "\t'charset'\t\t=> '{$data['db_charset']}'," . PHP_EOL;
	$db_config_file .= "\t'prefix'\t\t=> '{$data['db_prefix']}'," . PHP_EOL;
	$db_config_file .= "\t'options'\t\t=> [" . PHP_EOL;
	$db_config_file .= "\t\tPDO::ATTR_PERSISTENT => true," . PHP_EOL;
	$db_config_file .= "\t\tPDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION," . PHP_EOL;
	$db_config_file .= "\t\tPDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES {$data['db_charset']}'" . PHP_EOL;
	$db_config_file .= "\t]" . PHP_EOL;
	$db_config_file .= "];" . PHP_EOL;
	if(!file_exists($db_config_path)) {
		mkdir($db_config_path, 0755, true);
	}
	file_put_contents($db_config_path . '/database.php', $db_config_file, LOCK_EX);

	// ROBOTS
	$robots_txt = 'User-agent: *' . PHP_EOL;
	$robots_txt .= 'Disallow: /404' . PHP_EOL;
	$robots_txt .= 'Disallow: /admin' . PHP_EOL;
	$robots_txt .= 'Disallow: /admin/' . PHP_EOL . PHP_EOL;
	$robots_txt .= 'Sitemap: ' . $site_url . '/sitemap.xml';
	file_put_contents(ROOT_DIR . '/robots.txt', $robots_txt, LOCK_EX);

	// SITEMAP
	$sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
	$sitemap_xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' . PHP_EOL;
	$sitemap_xml .= '<url><loc>' . $site_url . '</loc><lastmod>' . date('c') . '</lastmod><priority>1.00</priority></url>' . PHP_EOL;
	$sitemap_xml .= '</urlset>';
	file_put_contents(ROOT_DIR . '/sitemap.xml', $sitemap_xml, LOCK_EX);

	// UPLOAD FOLDER
	if(!file_exists(ROOT_DIR . '/upload')) {
		mkdir(ROOT_DIR . '/upload', 0755, true);
	}

	// INSTALL PROCESS
	$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $data['db_host'], $data['db_name'], $data['db_charset']);

	$options = [
		PDO::ATTR_PERSISTENT => true,
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . $data['db_charset']
	];

	$connection = new PDO($dsn, $data['db_user'], $data['db_pass'], $options);

	$install_file = file_get_contents(ROOT_DIR . '/module/Install/engine.sql');
	executeSQL($data, $connection, $install_file);

	// DEMO DATA
	if(isset($data['demo_data']) && $data['demo_data'] === 'on') {
		$demo_file = file_get_contents(ROOT_DIR . '/module/Install/demo/demo.sql');
		executeSQL($data, $connection, $demo_file);

		if(file_exists(ROOT_DIR . '/upload/demo')) {
			unlink(ROOT_DIR . '/upload/demo');
		} else {
			mkdir(ROOT_DIR . '/upload/demo', 0755, true);
		}

		foreach(glob(ROOT_DIR . '/module/Install/demo/upload/*.*') as $file) {
			copy($file, ROOT_DIR . '/upload/demo/' . file_name($file) . '.' . file_extension($file));
		}
	}

	return true;
}

function executeSQL($data, $connection, $sql) {
	$replace_from = [
		'%prefix%',
		'%site_name%', '%contact_email%',
		'%admin_login%', '%admin_password%', '%admin_email%', '%auth_token%'
	];
	$replace_to = [
		$data['db_prefix'],
		$data['site_name'], $data['contact_email'],
		$data['admin_login'], password_hash($data['admin_password'], PASSWORD_DEFAULT), $data['admin_email'], generateAuthToken($data)
	];

	$sql_formatted = str_replace($replace_from, $replace_to, $sql);

	$connection->query($sql_formatted);
}

function storePostData() {
	foreach($_POST as $key => $value) {
		${$key} = $value;
		$_SESSION[$key] = $value;
	}
}

function generateAuthToken($data) {
	$auth_token = md5($data['admin_login'].$data['admin_password'].$data['admin_email'].time());
	setcookie('auth_token', $auth_token, time() + 3600 * 24 * 7, '/');

	return $auth_token;
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

	<link rel="icon" href="/module/Admin/View/Asset/favicon.ico" sizes="any">
	<link rel="icon" href="/module/Admin/View/Asset/favicon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="/module/Admin/View/Asset/favicon.png">

	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</head>

<body>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<h1 class="h2"><?= Define::NAME ?></h1>
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
											echo '<p>Удалите все таблицы в БД <b>' . $_POST['db_name'] . '</b> и попробуйте снова.</p>';
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
