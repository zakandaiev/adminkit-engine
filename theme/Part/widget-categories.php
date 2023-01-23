<?php
	$w_categories = $page_model->getCategories(['limit' => 5]);
?>
<?php if(!empty($w_categories)): ?>
	<div class="aside-widget">
		<div class="section-title">
			<h2 class="title"><?= __('Categories') ?></h2>
		</div>
		<div class="category-widget">
			<ul>
				<?php foreach($w_categories as $category): ?>
					<li><a href="<?= site('url_language') ?>/<?= $category->url ?>"><?= $category->title ?> <span><?= $category->count_pages ?></span></a></li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
<?php endif; ?>
