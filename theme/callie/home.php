<?php Theme::header(); ?>

<?php
	$mvp = $model->getMVP(['where' => 'image IS NOT null', 'limit' => 3]);
?>
<?php if(!empty($mvp)): ?>
	<div class="section">
		<div class="container">
			<div id="hot-post" class="row hot-post">
				<div class="col-md-8 hot-post-left">
					<?= getPosts($mvp, ['type' => 1, 'limit' => 1]) ?>
				</div>
				<?php if(count($mvp) > 1): ?>
					<div class="col-md-4 hot-post-right">
						<?= getPosts($mvp, ['type' => 1, 'limit' => 2, 'offset' => 1]) ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
<?php endif; ?>


<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<?php
					$recent_posts = $model->getPages(['where' => 'is_category IS false AND is_static IS false AND image IS NOT null', 'limit' => 4]);
				?>
				<?php if(!empty($recent_posts)): ?>
					<div class="row">
						<div class="col-md-12">
							<div class="section-title">
								<h2 class="title"><?= $page->custom_fields->section_recent_posts ?? 'Recent posts' ?></h2>
							</div>
						</div>
						<?= getPosts($recent_posts, ['type' => 2, 'wrap' => 'col-md-6']) ?>
					</div>
				<?php endif; ?>

				<?php
					$lifestyle_posts = $model->getPagesInCategory(4, ['where' => 'image IS NOT null', 'limit' => 3]);
				?>
				<?php if(!empty($lifestyle_posts)): ?>
					<div class="row">
						<div class="col-md-12">
							<div class="section-title">
								<h2 class="title"><?= $page->custom_fields->section_lifestyle ?? 'Lifestyle' ?></h2>
							</div>
						</div>
						<?= getPosts($lifestyle_posts, ['type' => 3, 'wrap' => 'col-md-4']) ?>
					</div>
				<?php endif; ?>

				<?php
					$fashion_travel_posts = $model->getPagesInCategory('5,7', ['where' => 'image IS NOT null', 'limit' => 3]);
				?>
				<?php if(!empty($fashion_travel_posts)): ?>
					<div class="row">
						<div class="col-md-12">
							<div class="section-title">
								<h2 class="title">Fashion & Travel</h2>
							</div>
						</div>
						<?= getPosts($fashion_travel_posts, ['type' => 3, 'wrap' => 'col-md-4']) ?>
					</div>
				<?php endif; ?>

				<?php
					$technology_posts = $model->getPagesInCategory(6, ['where' => 'image IS NOT null', 'limit' => 3]);
				?>
				<?php if(!empty($technology_posts)): ?>
					<div class="row">
						<div class="col-md-12">
							<div class="section-title">
								<h2 class="title">Technology</h2>
							</div>
						</div>
						<?= getPosts($technology_posts, ['type' => 3, 'wrap' => 'col-md-4']) ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="col-md-4">
				<?php Theme::sidebar(); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
