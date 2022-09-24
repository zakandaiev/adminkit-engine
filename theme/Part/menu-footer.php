<?php if($menu && !empty($menu->items)): ?>
	<ul class="footer-nav">
		<?php foreach($menu->items as $item): ?>
			<li><a href="<?= site('url_language') ?>/<?= $item->url ?>"><?= $item->name ?></a></li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>
