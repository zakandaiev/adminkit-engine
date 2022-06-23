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
			<div class="col-md-5">
				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('OUR STORY') ?></h2>
					</div>
					<?= @$page->custom_fields->story ?>
					<blockquote class="blockquote">
						<p><?= @$page->custom_fields->quote ?></p>
						<footer class="blockquote-footer"><?= @$page->custom_fields->quote_author ?></footer>
					</blockquote>
				</div>
			</div>
			<div class="col-md-7">
				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('OUR VISION') ?></h2>
					</div>
					<?= @$page->custom_fields->vision ?>
				</div>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
