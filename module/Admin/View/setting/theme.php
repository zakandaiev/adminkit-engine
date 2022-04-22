<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3"><?= __('sidebar', 'settings') ?> <i data-feather="arrow-right"></i> <?= __('setting', 'section_' . $section) ?></h1>

				<div class="row">
					<?php foreach($themes as $theme): ?>
						<div class="col-12 col-md-4 col-lg-3">
							<div class="card">
								<img class="card-img-top" src="<?= $theme->url ?>/<?= $theme->image ?>" alt="Preview" data-fancybox>
								<div class="card-header">
									<h4><?= $theme->name ?></h4>
									<h5 class="card-title mb-0" class="mb-0">v<?= $theme->version ?></h5>
								</div>
								<div class="card-body pt-0">
									<p class="card-text"><?= $theme->description ?></p>
									<form method="POST" data-redirect="this">
										<input type="hidden" name="theme" value="<?= $theme->key ?>">
										<?php if($theme->key === $settings->theme): ?>
											<button type="submit" class="btn btn-success disabled" disabled>Active</button>
										<?php else: ?>
											<button type="submit" class="btn btn-primary">Activate</button>
										<?php endif; ?>
									</form>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
