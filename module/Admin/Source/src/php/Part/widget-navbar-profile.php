<li class="nav-item dropdown">
	<a class="nav-icon dropdown-toggle d-inline-block d-sm-none" href="<?= site('url_language') ?>/admin" data-bs-toggle="dropdown">
		<i class="align-middle" data-feather="settings"></i>
	</a>
	<a class="nav-icon pe-md-0 dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
		<img src="<?= site('url') ?>/<?= placeholder_avatar(User::get()->avatar) ?>" class="avatar img-fluid rounded" alt="<?= User::get()->name ?>">
	</a>
	<div class="dropdown-menu dropdown-menu-end">
		<a class="dropdown-item" href="<?= site('url_language') ?>/admin/profile"><i class="align-middle me-1" data-feather="user"></i> <?= __('Profile') ?></a>
		<a class="dropdown-item" href="<?= site('url_language') ?>/admin/profile/edit"><i class="align-middle me-1" data-feather="settings"></i> <?= __('Settings') ?></a>
		<div class="dropdown-divider"></div>
		<a class="dropdown-item" href="<?= site('url_language') ?>/admin/logout"><i class="align-middle me-1" data-feather="log-out"></i> <?= __('Logout') ?></a>
	</div>
</li>
