<?php
	$notifications = Auth::$user->notifications;
	$notifications_count = Auth::$user->notifications_count;
?>

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
			<?= __('New Notifications') ?>
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
								<div class="text-dark"><?= __($notification->kind) ?></div>
								<div class="text-muted small mt-1"><?= date_when($notification->date_created) ?></div>
							</div>
						</div>
					</a>
				<?php endforeach; ?>
			<?php else: ?>
				<a href="/admin/profile" class="list-group-item">
					<div class="text-muted small"><?= __('No new notifications') ?></div>
				</a>
			<?php endif; ?>
		</div>
		<div class="dropdown-menu-footer">
			<a href="/admin/profile" class="text-muted"><?= __('Show all') ?></a>
		</div>
	</div>
</li>
