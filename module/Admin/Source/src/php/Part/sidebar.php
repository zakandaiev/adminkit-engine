<?php

function checkRouteAccess($route) {
	if(User::get()->access_all) {
		return true;
	}

	if(is_array($route)) {
		$route = array_map(function($string) {
			return trim($string ?? '', '/');
		}, $route);
	} else {
		$route = trim($route ?? '', '/');
	}

	foreach(User::get()->routes as $user_route) {
		list($method, $uri) = explode('@', $user_route);

		$uri = trim($uri ?? '', '/');

		if($method !== 'get') {
			continue;
		}

		if(is_array($route) && in_array($uri, $route)) {
			return true;
		} else if($route === $uri) {
			return true;
		}
	}

	return false;
}

?>

<nav id="sidebar" class="sidebar js-sidebar">
	<div class="sidebar-content js-simplebar">
		<a class="sidebar-brand" href="<?= site('url_language') ?>/admin">
			<?php if(!empty(site('logo_admin'))): ?>
				<img src="<?= site('url') ?>/<?= site('logo_admin') ?>" alt="Logo" class="d-block m-auto img-fluid">
			<?php else: ?>
				<span><?= site('name') ?></span>
			<?php endif; ?>
		</a>

		<ul class="sidebar-nav">
			<?php foreach($GLOBALS['admin_sidebar'] as $item): ?>
				<?php
					if(!@$item['is_public'] && !checkRouteAccess(@$item['route'])) {
						continue;
					}
					$target_id = preg_replace('/[^a-z]+/', '-', strtolower($item['name'] ?? ''));
					$target_id = 'sidebar-' . trim($target_id, '-') . '-' . Hash::token(4);
				?>
				<?php if(isset($item['is_divider']) && $item['is_divider']): ?>
					<li class="sidebar-header"><?= $item['name'] ?></li>
				<?php elseif(is_array($item['route'])): ?>
					<li class="sidebar-item <?php if(is_route_active($item['route'])): ?>active<?php endif; ?>">
						<a data-bs-target="#<?= $target_id ?>" data-bs-toggle="collapse" class="sidebar-link collapsed">
							<i class="align-middle" data-feather="<?= $item['icon'] ?>"></i> <span class="align-middle"><?= $item['name'] ?></span>
						</a>
						<ul id="<?= $target_id ?>" class="sidebar-dropdown list-unstyled collapse <?php if(is_route_active($item['route'])): ?>show<?php endif; ?>" data-bs-parent="#sidebar">
							<?php foreach($item['route'] as $key => $value): ?>
								<li class="sidebar-item <?php if(is_route_active($value)): ?>active<?php endif; ?>"><a class="sidebar-link" href="<?= site('url_language') . $value ?>"><?= $key ?></a></li>
							<?php endforeach; ?>
						</ul>
					</li>
				<?php else: ?>
					<li class="sidebar-item <?php if(is_route_active($item['route'])): ?>active<?php endif; ?>">
						<a class="sidebar-link" href="<?= site('url_language') . $item['route'] ?>">
							<i class="align-middle" data-feather="<?= $item['icon'] ?>"></i>
							<span class="align-middle"><?= $item['name'] ?></span>
							<?php
								if(
									isset($item['badge'])
									&& (
										(!is_closure($item['badge']) && !empty($item['badge']))
										||
										(is_closure($item['badge']) && !empty($item['badge']()))
									)
								):
							?>
								<span class="sidebar-badge badge bg-<?php if(isset($item['badge_color'])): ?><?= $item['badge_color'] ?><?php else: ?>primary<?php endif; ?>">
									<?php if(is_closure($item['badge'])): ?>
										<?= $item['badge']() ?>
									<?php else: ?>
										<?= $item['badge'] ?>
									<?php endif; ?>
								</span>
							<?php endif; ?>
						</a>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
	</div>
</nav>
