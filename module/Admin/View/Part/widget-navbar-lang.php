<?php

$uri = Request::$uri;
$uri = trim($uri, '/');
$uri_parts = explode('/', $uri);

if(array_key_exists($uri_parts[0], Module::get('languages'))) {
	array_shift($uri_parts);
	$uri = implode('/', $uri_parts);
}

$uri = '/' . $uri;

?>

<li class="nav-item dropdown">
	<a class="nav-flag dropdown-toggle" href="#" id="languageDropdown" data-bs-toggle="dropdown">
		<img src="<?= Asset::url() ?>/img/flags/<?= site('language_current') ?>.png" alt="<?= site('language_current') ?>">
	</a>
	<div class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
		<?php foreach(Module::get('languages') as $language): ?>
			<?php if($language['key'] === site('language_current')) continue; ?>
			<a class="dropdown-item" href="<?= site('url') ?>/<?= $language['key'] . $uri ?>">
				<img src="<?= Asset::url() ?>/img/flags/<?= $language['key'] ?>.png" alt="<?= $language['key'] ?>" width="20" height="14" class="align-middle me-1">
				<span class="align-middle"><?= $language['name'] ?></span>
			</a>
		<?php endforeach; ?>
	</div>
</li>
