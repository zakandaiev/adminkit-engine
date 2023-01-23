<?php Theme::header(); ?>

<div class="page-header">
	<?php if(!empty($tag->image)): ?>
		<div class="page-header-bg" style='background-image: url("<?= site('url') ?>/<?= $tag->image ?>")' data-stellar-background-ratio="0.5"></div>
	<?php endif; ?>
	<div class="container">
		<div class="row">
			<div class="col-md-offset-1 col-md-10 text-center">
				<h1 class="text-uppercase"><?= $tag->name ?></h1>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<?php
					$tag_pages = $page_model->getPagesByTag($tag->id, ['paginate' => true]);
				?>
				<?php if(!empty($tag_pages)): ?>
					<?= getPosts($tag_pages, ['type' => 1, 'limit' => 1]) ?>
				<?php endif; ?>

				<?php if(count($tag_pages) > 1): ?>
					<div class="row">
						<?= getPosts($tag_pages, ['type' => 2, 'wrap' => 'col-md-6', 'limit' => 2, 'offset' => 1]) ?>
					</div>
				<?php endif; ?>

				<?php if(count($tag_pages) > 3): ?>
					<?= getPosts($tag_pages, ['type' => 5, 'offset' => 3]) ?>
				<?php endif; ?>

				<div class="section-row loadmore text-center">
					<?php Theme::pagination(); ?>
				</div>
			</div>

			<div class="col-md-4">
				<?php Theme::sidebar(); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
