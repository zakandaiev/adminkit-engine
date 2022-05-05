<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3"><?= __('Settings') ?> <i data-feather="arrow-right"></i> <?= __('Optimization') ?></h1>

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="group_css" name="group_css" <?php if($settings->group_css == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="group_css">Group CSS assets</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="group_js" name="group_js" <?php if($settings->group_js == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="group_js">Group JS assets</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="cache_db" name="cache_db" <?php if($settings->cache_db == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="cache_db">Cache Database Queries</label>
									</div>
									<button type="submit" class="btn btn-primary">Submit</button>
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
