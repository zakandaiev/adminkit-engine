<?php Theme::header(); ?>

<div class="section">
	<div class="container">
		<div class="section-row">
			<div class="section-title">
				<h3 class="title">Page not found</h3>
			</div>

			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
			
			<?php if(isset(Request::$referer)): ?>
				<a href="<?= Request::$referer ?>" class="primary-button"><?= __('Go back') ?></a>
				<?php if(trim(Request::$referer, '/') !== Request::$base): ?>
					<a href="<?= site('url_language') ?>/" class="secondary-button"><?= __('Homepage') ?></a>
				<?php endif; ?>
			<?php else: ?>
				<a href="<?= site('url_language') ?>/" class="primary-button"><?= __('Homepage') ?></a>
			<?php endif; ?>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
