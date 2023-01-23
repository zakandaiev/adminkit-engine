<?php Theme::header(); ?>

<?php $author_socials = json_decode($author->socials) ?? []; ?>

<div class="page-header">
	<div class="container">
		<div class="row">
			<div class="col-md-offset-1 col-md-10 text-center">
				<div class="author">
					<?php if(!empty($author->avatar)): ?>
						<img class="author-img center-block" src="<?= site('url') ?>/<?= placeholder_avatar($author->avatar) ?>" alt="<?= $author->name ?>">
					<?php endif; ?>
					<h1 class="text-uppercase"><?= $author->name ?></h1>
					<p class="lead"><?= $author->about ?></p>
					<ul class="author-social">
						<?php foreach($author_socials as $social): ?>
							<li><a href="<?= html($social->link) ?>" target="_blank"><i class="fa fa-<?= $social->type ?>"></i></a></li>
						<?php endforeach; ?>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<?php
					$author_pages = $page_model->getPagesByAuthor($author->id, ['paginate' => true]);
				?>
				<?php if(!empty($author_pages)): ?>
					<?= getPosts($author_pages, ['type' => 1, 'limit' => 1]) ?>
				<?php endif; ?>

				<?php if(count($author_pages) > 1): ?>
					<div class="row">
						<?= getPosts($author_pages, ['type' => 2, 'wrap' => 'col-md-6', 'limit' => 2, 'offset' => 1]) ?>
					</div>
				<?php endif; ?>

				<?php if(count($author_pages) > 3): ?>
					<?= getPosts($author_pages, ['type' => 5, 'offset' => 3]) ?>
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
