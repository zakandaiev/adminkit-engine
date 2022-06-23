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
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="group_css" name="group_css" <?php if($settings->group_css != 'false' && !empty($settings->group_css)): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="group_css">
											<?= __('Group CSS assets') ?>
											<?php if($settings->group_css != 'false' && !empty($settings->group_css)): ?>
												<?php
													$file_url = Path::url('asset', 'Public') . '/css/' . $settings->group_css . '.css';
													$file_path = Path::file('asset', 'Public') . '/css/' . $settings->group_css . '.css';
												?>
												<br>
												<a class="text-sm" href="<?= $file_url ?>" target="_blank"><?= __('Final size') ?>: <?= file_size($file_path) ?></a>
											<?php endif; ?>
										</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="group_js" name="group_js" <?php if($settings->group_js != 'false' && !empty($settings->group_js)): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="group_js">
											<?= __('Group JS assets') ?>
											<?php if($settings->group_js != 'false' && !empty($settings->group_js)): ?>
												<?php
													$file_url = Path::url('asset', 'Public') . '/js/' . $settings->group_js . '.js';
													$file_path = Path::file('asset', 'Public') . '/js/' . $settings->group_js . '.js';
												?>
												<br>
												<a class="text-sm" href="<?= $file_url ?>" target="_blank"><?= __('Final size') ?>: <?= file_size($file_path) ?></a>
											<?php endif; ?>
										</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="cache_db" name="cache_db" <?php if($settings->cache_db == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="cache_db"><?= __('Cache database queries') ?></label>
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
