<li class="nav-item dropdown">
	<a class="nav-flag dropdown-toggle" href="#" id="languageDropdown" data-bs-toggle="dropdown">
		<img src="<?= Asset::url() ?>/img/flags/<?= Setting::get('main')->language ?>.png" alt="<?= Setting::get('main')->language ?>">
	</a>
	<div class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
		<?php foreach(Module::get('languages') as $language): ?>
			<?php if($language['key'] === site('lang_current')) continue; ?>
			<a class="dropdown-item" href="<?= site('url') ?>/<?= $language['key'] ?><?= site('uri') ?>">
				<img src="<?= Asset::url() ?>/img/flags/<?= $language['key'] ?>.png" alt="<?= $language['name'] ?>" width="20" height="14" class="align-middle me-1">
				<span class="align-middle"><?= $language['name'] ?></span>
			</a>
		<?php endforeach; ?>
	</div>
</li>
