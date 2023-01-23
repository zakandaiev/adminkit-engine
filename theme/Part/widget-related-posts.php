<?php
	$w_related_posts = $page_model->getRelatedPages($page, ['where' => 'image IS NOT null', 'limit' => 3]);
?>
<?php if(!empty($w_related_posts)): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title"><?= __('Related Posts') ?></h3>
		</div>
		<div class="row">
			<?= getPosts($w_related_posts, ['type' => 3, 'wrap' => 'col-md-4']) ?>
		</div>
	</div>
<?php endif; ?>
