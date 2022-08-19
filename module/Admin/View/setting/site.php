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

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<div class="row">
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Admin logo') ?></label>
												<input type="file" accept="image/*" name="logo_admin" data-value='<?= Form::populateFiles($settings->logo_admin) ?>'>
											</div>
										</div>
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Public logo') ?></label>
												<input type="file" accept="image/*" name="logo_public" data-value='<?= Form::populateFiles($settings->logo_public) ?>'>
											</div>
										</div>
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Logo alternative') ?></label>
												<input type="file" accept="image/*" name="logo_alt" data-value='<?= Form::populateFiles($settings->logo_alt) ?>'>
											</div>
										</div>
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Icon') ?></label>
												<input type="file" accept="image/png,image/x-icon,image/svg+xml" name="icon" data-value='<?= Form::populateFiles($settings->icon) ?>'>
											</div>
										</div>
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Placeholder avatar') ?></label>
												<input type="file" accept="image/*" name="placeholder_avatar" data-value='<?= Form::populateFiles($settings->placeholder_avatar) ?>'>
											</div>
										</div>
										<div class="col-md-4">
											<div class="form-group mb-3 filepond--no-grid">
												<label class="form-label"><?= __('Placeholder image') ?></label>
												<input type="file" accept="image/*" name="placeholder_image" data-value='<?= Form::populateFiles($settings->placeholder_image) ?>'>
											</div>
										</div>
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Name') ?></label>
										<input type="text" name="name" placeholder="<?= __('Name') ?>" value="<?= $settings->name ?>" class="form-control" required>
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Description') ?></label>
										<input type="text" name="description" placeholder="<?= __('Description') ?>" value="<?= $settings->description ?>" class="form-control">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Google analytics tag') ?></label>
										<input type="text" name="analytics_gtag" placeholder="<?= __('Google analytics tag') ?>" value="<?= $settings->analytics_gtag ?>" class="form-control">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Pagination limit') ?></label>
										<input type="number" name="pagination_limit" value="<?= $settings->pagination_limit ?>" class="form-control">
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="no_index_no_follow" name="no_index_no_follow" <?php if($settings->no_index_no_follow == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="no_index_no_follow"><?= __('Set') ?> noindex <?= __('and') ?> nofollow <?= __('to all pages') ?></label>
									</div>
									<button type="submit" class="btn btn-primary"><?= __('Save') ?></button>
								</form>
							</div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
