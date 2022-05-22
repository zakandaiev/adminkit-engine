<?php if(!empty($menu)): ?>
	<ul class="footer-nav">
		<?php foreach($menu as $item): ?>
			<li><a href="<?= $item['url'] ?>"><?= $item['name'] ?></a></li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>
