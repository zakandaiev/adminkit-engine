<?php
	$page->title = __('Edit contact settings');
	Breadcrumb::add(__('Settings'), '/admin/setting/' . $section);
	Breadcrumb::add(__('Contacts'));
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

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<div class="mb-3">
										<label class="form-label"><?= __('Address') ?></label>
										<input type="text" name="address" placeholder="<?= __('Address') ?>" value="<?= $settings->address ?>" class="form-control">
									</div>
									<div class="row">
										<div class="col-md-6">
											<div class="form-group mb-3">
												<label class="form-label"><?= __('Coordinate X') ?></label>
												<input type="text" name="coordinate_x" placeholder="<?= __('Coordinate X') ?>" value="<?= $settings->coordinate_x ?>" class="form-control">
											</div>
										</div>
										<div class="col-md-6">
											<div class="form-group mb-3">
												<label class="form-label"><?= __('Coordinate Y') ?></label>
												<input type="text" name="coordinate_y" placeholder="<?= __('Coordinate Y') ?>" value="<?= $settings->coordinate_y ?>" class="form-control">
											</div>
										</div>
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Work hours') ?></label>
										<input type="text" name="hours" placeholder="<?= __('Work hours') ?>" value="<?= $settings->hours ?>" class="form-control">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Email') ?></label>
										<input type="text" name="email" placeholder="<?= __('Email') ?>" value="<?= $settings->email ?>" class="form-control" required>
									</div>
									<div class="mb-3">
										<?= Theme::block('form-phones') ?>
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
