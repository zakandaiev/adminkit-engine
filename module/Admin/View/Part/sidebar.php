<?php

$uri = site('uri_cut_language');

$sidebar = [
	[
		'icon' => 'home',
		'name' => 'Dashboard',
		'route' => '/admin'
	],
	[
		'icon' => 'user',
		'name' => 'Profile',
		'route' => '/admin/profile'
	],
	[
		'icon' => 'log-out',
		'name' => 'Logout',
		'route' => '/admin/logout'
	],
	[
		'name' => 'Content',
		'is_divider' => true,
		'access_groups' => [3]
	],
	[
		'icon' => 'layout',
		'name' => 'Pages',
		'route' => '/admin/page',
		'access_groups' => [3]
	],
	[
		'icon' => 'message-square',
		'name' => 'Comments',
		'route' => '/admin/comment',
		'access_groups' => [3]
	],
	[
		'icon' => 'menu',
		'name' => 'Menu',
		'route' => '/admin/menu',
		'access_groups' => [3]
	],
	[
		'name' => 'Administration',
		'is_divider' => true,
		'access_groups' => [2]
	],
	[
		'icon' => 'users',
		'name' => 'Users',
		'route' => [
			'Users' => '/admin/user',
			'Groups' => '/admin/group'
		],
		'access_groups' => [2]
	],
	[
		'icon' => 'settings',
		'name' => 'Settings',
		'route' => [
			'Main' => '/admin/setting/main',
			'Site' => '/admin/setting/site',
			'Contacts' => '/admin/setting/contact',
			'Optimizations' => '/admin/setting/optimization'
		],
		'access_groups' => [2]
	],
];

?>

<nav id="sidebar" class="sidebar js-sidebar">
	<div class="sidebar-content js-simplebar">
		<a class="sidebar-brand" href="<?= site('url_language') ?>/admin">
			<?php if(!empty(site('logo_admin'))): ?>
				<img src="<?= Request::$base ?>/<?= site('logo_admin') ?>" alt="Logo" class="d-block m-auto img-fluid">
			<?php else: ?>
				<span class="align-middle"><?= site('name') ?></span>
			<?php endif; ?>
		</a>

		<ul class="sidebar-nav">
			<?php foreach($sidebar as $item): ?>
				<?php if(isset($item['access_groups']) && !Auth::$user->access_all && count(array_intersect($item['access_groups'], Auth::$user->groups)) <= 0) continue; ?>
				<?php if(isset($item['is_divider']) && $item['is_divider']): ?>
					<li class="sidebar-header"><?= $item['name'] ?></li>
				<?php elseif(is_array($item['route'])): ?>
					<li class="sidebar-item <?php if(in_array($uri, $item['route'])): ?>active<?php endif; ?>">
						<a data-bs-target="#<?= strtolower($item['name']) ?>" data-bs-toggle="collapse" class="sidebar-link collapsed">
							<i class="align-middle" data-feather="<?= $item['icon'] ?>"></i> <span class="align-middle"><?= $item['name'] ?></span>
						</a>
						<ul id="<?= strtolower($item['name']) ?>" class="sidebar-dropdown list-unstyled collapse <?php if(in_array($uri, $item['route'])): ?>show<?php endif; ?>" data-bs-parent="#sidebar">
							<?php foreach($item['route'] as $key => $value): ?>
								<li class="sidebar-item <?php if($value === $uri): ?>active<?php endif; ?>"><a class="sidebar-link" href="<?= site('url_language') . $value ?>"><?= $key ?></a></li>
							<?php endforeach; ?>
						</ul>
					</li>
				<?php else: ?>
					<li class="sidebar-item <?php if($item['route'] === $uri): ?>active<?php endif; ?>">
						<a class="sidebar-link" href="<?= site('url_language') . $item['route'] ?>">
							<i class="align-middle" data-feather="<?= $item['icon'] ?>"></i> <span class="align-middle"><?= $item['name'] ?></span>
						</a>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
	</div>
</nav>
