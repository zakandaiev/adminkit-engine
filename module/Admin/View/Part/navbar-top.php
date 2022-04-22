<?php
	$notifications = Auth::$user->notifications;
	$notifications_count = Auth::$user->notifications_count;
?>

<nav class="navbar navbar-expand navbar-light navbar-bg">
	<a class="sidebar-toggle js-sidebar-toggle">
		<i class="hamburger align-self-center"></i>
	</a>

	<div class="navbar-collapse collapse">
		<ul class="navbar-nav navbar-align">
			<li class="nav-item dropdown">
				<a class="nav-icon dropdown-toggle" href="/admin" id="notifications" data-bs-toggle="dropdown">
					<div class="position-relative">
						<i class="align-middle" data-feather="bell"></i>
						<?php if($notifications_count > 0): ?>
							<span class="indicator"><?= $notifications_count ?></span>
						<?php endif; ?>
					</div>
				</a>
				<div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="notifications">
					<div class="dropdown-menu-header">
						<?= __('navbar', 'top/new_notif') ?>
					</div>
					<div class="list-group">
						<?php if($notifications_count > 0): ?>
							<?php foreach($notifications as $notification): ?>
								<a href="/admin/profile" class="list-group-item">
									<div class="row g-0 align-items-center">
										<div class="col-2">
											<?= getNotificationIcon($notification->kind) ?>
										</div>
										<div class="col-10">
											<div class="text-dark"><?= ___('notification', $notification->kind) ?></div>
											<div class="text-muted small mt-1"><?= date_when($notification->date_created) ?></div>
										</div>
									</div>
								</a>
							<?php endforeach; ?>
						<?php else: ?>
							<a href="/admin/profile" class="list-group-item">
								<div class="text-dark"><?= ___('notification', 'no_new_notifications') ?></div>
							</a>
						<?php endif; ?>
					</div>
					<div class="dropdown-menu-footer">
						<a href="/admin/profile" class="text-muted">Show all</a>
					</div>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-flag dropdown-toggle" href="/admin" id="languageDropdown" data-bs-toggle="dropdown">
					<img src="<?= Asset::url() ?>/img/flags/<?= Module::get('languages')[Setting::get('main')->language]['key'] ?>.png" alt="<?= Module::get('languages')[Setting::get('main')->language]['title'] ?>">
				</a>
				<div class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
					<?php foreach(Module::get('languages') as $language): ?>
						<a class="dropdown-item" href="/admin">
							<img src="<?= Asset::url() ?>/img/flags/<?= $language['key'] ?>.png" alt="<?= $language['title'] ?>" width="20" height="14" class="align-middle me-1">
							<span class="align-middle"><?= $language['title'] ?></span>
						</a>
					<?php endforeach; ?>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-icon dropdown-toggle d-inline-block d-sm-none" href="/admin" data-bs-toggle="dropdown">
					<i class="align-middle" data-feather="settings"></i>
				</a>
				<a class="nav-icon pe-md-0 dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
					<img src="<?= Asset::url() ?>/img/no_avatar.jpg" class="avatar img-fluid rounded" alt="Charles Hall">
				</a>
				<div class="dropdown-menu dropdown-menu-end">
					<a class="dropdown-item" href="/admin/profile"><i class="align-middle me-1" data-feather="user"></i> Profile</a>
					<a class="dropdown-item" href="/admin/profile/edit"><i class="align-middle me-1" data-feather="settings"></i> Settings</a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="/admin/logout"><i class="align-middle me-1" data-feather="log-out"></i> Logout</a>
				</div>
			</li>
		</ul>
	</div>
</nav>
