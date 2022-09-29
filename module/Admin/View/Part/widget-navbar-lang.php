<?php

$uri = site('uri_cut_language');

?>

<li class="nav-item dropdown">
	<a class="nav-flag dropdown-toggle" href="#" id="languageDropdown" data-bs-toggle="dropdown">
		<img src="<?= Asset::url() ?>/<?= lang(site('language_current'), 'icon') ?>" alt="<?= site('language_current') ?>">
	</a>
	<div class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
		<?php foreach(site('languages') as $language): ?>
			<?php if($language['key'] === site('language_current')) continue; ?>
			<a class="dropdown-item" href="<?= site('url') ?>/<?= $language['key'] . $uri ?>">
				<img src="<?= Asset::url() ?>/<?= lang($language['key'], 'icon') ?>" alt="<?= $language['key'] ?>" width="20" height="14" class="align-middle me-1">
				<span class="align-middle"><?= $language['name'] ?></span>
			</a>
		<?php endforeach; ?>
	</div>
</li>
