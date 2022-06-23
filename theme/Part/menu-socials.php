<?php

$menu_class = $class ?? 'nav-social';

?>

<?php if($menu && !empty($menu->items)): ?>
	<ul class="<?= $menu_class ?>">
		<?php foreach($menu->items as $item): ?>
			<li><a href="<?= $item->url ?>" <?= isset($class) ? 'class="social-' . strtolower($item->name ?? '') . '"' : '' ?> target="_blank"><i class="fa fa-<?= strtolower($item->name ?? '') ?>"></i></a></li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>
