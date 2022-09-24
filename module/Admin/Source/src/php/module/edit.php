<?php
	$page->title = __('Edit module');
	Breadcrumb::add(__('Modules'), '/admin/module');
	Breadcrumb::add(__('Edit'));
	Breadcrumb::add($module['name']);
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
						<form method="POST" data-redirect="<?= site('url_language') ?>/admin/module">
							<div class="row">
								<div class="col-xs-12 col-md-6">
									<div class="mb-3">
										<label class="form-label"><?= __('Priority') ?></label>
										<input type="number" name="priority" value="<?= @$module['priority'] ?>" placeholder="<?= __('Priority') ?>" class="form-control" min="0">
									</div>
								</div>
								<div class="col-xs-12 col-md-6">
									<div class="mb-3">
										<label class="form-label"><?= __('Version') ?></label>
										<input type="text" name="version" value="<?= $module['version'] ?>" placeholder="<?= __('Version') ?>" class="form-control" minlength="1">
									</div>
								</div>
							</div>
							<div class="mb-3">
								<label class="form-label"><?= __('Extends') ?></label>
								<input type="text" name="extends" value="<?= @$module['extends'] ?>" placeholder="<?= __('Extends') ?>" class="form-control" minlength="2" maxlength="200">
							</div>
							<div class="mb-3">
								<label class="form-label"><?= __('Description') ?></label>
								<textarea name="description" class="form-control" required placeholder="<?= __('Description') ?>"><?= $module['description'] ?></textarea>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" <?php if($module['is_enabled']): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="is_enabled"><?= __('Active') ?></label>
							</div>
							<button type="submit" class="btn btn-primary"><?= __('Save') ?></button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
