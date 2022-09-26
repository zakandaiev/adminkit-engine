<?php
	$page->title = __('Add translation');
	Breadcrumb::add(__('Translations'), '/admin/translation');
	Breadcrumb::add(__('Add'));
?>

<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?= Breadcrumb::render() ?>
				</div>

				<div class="card">
					<div class="card-body">
						<form action="<?= site('permalink') ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/translation">
							<div class="form-group mb-3">
								<label class="form-label"><?= __('Language code') ?></label>
								<input type="text" name="key" placeholder="<?= __('For example') ?>: en" class="form-control" minlength="2" maxlength="2" required>
							</div>
							<div class="form-group mb-3">
								<label class="form-label"><?= __('Language region') ?></label>
								<input type="text" name="region" placeholder="<?= __('For example') ?>: US" class="form-control" minlength="2" maxlength="2" required>
							</div>
							<div class="form-group mb-3">
								<label class="form-label"><?= __('Language name') ?></label>
								<input type="text" name="name" placeholder="<?= __('For example') ?>: English" class="form-control" minlength="2" maxlength="32" required>
							</div>
							<div class="form-group mb-3">
								<label class="form-label"><?= __('Icon') ?></label>
								<input type="file" accept="image/*" name="icon" required>
							</div>
							<button type="submit" class="btn btn-primary"><?= __('Add translation') ?></button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
