<?php
	$page->title = __('Page not found');
?>

<?php Theme::header(); ?>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center">
						<h1 class="display-1 font-weight-bold">404</h1>
						<p class="h1"><?= __('Page not found') ?></p>
						<p class="h2 font-weight-normal mt-3 mb-4"><?= __('The page you are looking for might have been removed') ?></p>
						<?php if(isset(Request::$referer)): ?>
							<a href="<?= Request::$referer ?>" class="btn btn-secondary btn-lg"><?= __('Go back') ?></a>
							<?php if(trim(Request::$referer ?? '', '/') !== Request::$base): ?>
								<a href="<?= site('url_language') ?>/admin" class="btn btn-primary btn-lg"><?= __('Dashboard') ?></a>
							<?php endif; ?>
						<?php else: ?>
							<a href="<?= site('url_language') ?>/admin" class="btn btn-primary btn-lg"><?= __('Return to dashboard') ?></a>
						<?php endif; ?>
					</div>

				</div>
			</div>
		</div>
	</div>
</main>

<?php Theme::footer(); ?>
