<?php Theme::header(); ?>

<div class="page-header">
	<div class="container">
		<div class="row">
			<div class="col-md-offset-1 col-md-10 text-center">
				<h1 class="text-uppercase"><?= $page->title ?></h1>
				<?php if(!empty($page->excerpt)): ?>
					<p class="lead"><?= $page->excerpt ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<div class="section-row"><?= $page->content ?? $page->title ?></div>
			</div>
			<div class="col-md-4">
				<?php Theme::widget('socials'); ?>
				<?php Theme::widget('newsletter'); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>