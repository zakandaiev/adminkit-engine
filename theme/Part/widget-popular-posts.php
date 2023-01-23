<?php
	$w_popular_posts = $page_model->getMVP(['where' => 'image IS NOT null', 'limit' => 5]);
?>
<?php if(!empty($w_popular_posts)): ?>
	<div class="aside-widget">
		<div class="section-title">
			<h2 class="title"><?= __('Popular Posts') ?></h2>
		</div>
		<?= getPosts($w_popular_posts, ['type' => 4]) ?>
	</div>
<?php endif; ?>
