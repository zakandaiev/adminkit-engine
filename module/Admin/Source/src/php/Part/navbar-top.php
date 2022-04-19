<nav class="navbar navbar-expand navbar-light navbar-bg">
	<a class="sidebar-toggle js-sidebar-toggle">
		<i class="hamburger align-self-center"></i>
	</a>

	<div class="navbar-collapse collapse">
		<ul class="navbar-nav navbar-align">
			<li class="nav-item dropdown">
				<a class="nav-icon dropdown-toggle" href="/admin" id="alertsDropdown" data-bs-toggle="dropdown">
					<div class="position-relative">
						<i class="align-middle" data-feather="bell"></i>
						<span class="indicator">4</span>
					</div>
				</a>
				<div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="alertsDropdown">
					<div class="dropdown-menu-header">
						4 <?= Language::get('navbar')->top->new_notif ?>
					</div>
					<div class="list-group">
						<a href="/admin" class="list-group-item">
							<div class="row g-0 align-items-center">
								<div class="col-2">
									<i class="text-danger" data-feather="alert-circle"></i>
								</div>
								<div class="col-10">
									<div class="text-dark">Update completed</div>
									<div class="text-muted small mt-1">Restart server 12 to complete the update.</div>
									<div class="text-muted small mt-1">30m ago</div>
								</div>
							</div>
						</a>
						<a href="/admin" class="list-group-item">
							<div class="row g-0 align-items-center">
								<div class="col-2">
									<i class="text-warning" data-feather="bell"></i>
								</div>
								<div class="col-10">
									<div class="text-dark">Lorem ipsum</div>
									<div class="text-muted small mt-1">Aliquam ex eros, imperdiet vulputate hendrerit et.</div>
									<div class="text-muted small mt-1">2h ago</div>
								</div>
							</div>
						</a>
						<a href="/admin" class="list-group-item">
							<div class="row g-0 align-items-center">
								<div class="col-2">
									<i class="text-primary" data-feather="home"></i>
								</div>
								<div class="col-10">
									<div class="text-dark">Login from 192.186.1.8</div>
									<div class="text-muted small mt-1">5h ago</div>
								</div>
							</div>
						</a>
						<a href="/admin" class="list-group-item">
							<div class="row g-0 align-items-center">
								<div class="col-2">
									<i class="text-success" data-feather="user-plus"></i>
								</div>
								<div class="col-10">
									<div class="text-dark">New connection</div>
									<div class="text-muted small mt-1">Christina accepted your request.</div>
									<div class="text-muted small mt-1">14h ago</div>
								</div>
							</div>
						</a>
					</div>
					<div class="dropdown-menu-footer">
						<a href="/admin" class="text-muted">Show all notifications</a>
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