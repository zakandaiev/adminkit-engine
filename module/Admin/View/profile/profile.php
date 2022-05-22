<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">
				<div class="row mb-3">
					<div class="col-auto">
						<?= Breadcrumb::render() ?>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="/admin/profile/edit" class="btn btn-primary">Edit profile</a>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-xl-3">
						<div class="card mb-3">
							<div class="card-header">
								<h5 class="card-title mb-0">Details</h5>
							</div>
							<div class="card-body text-center">
								<img src="/<?= placeholder_avatar($user->avatar) ?>" alt="<?= $user->name ?>" class="rounded-circle mb-2" width="128" height="128" data-fancybox>
								<h5 class="card-title mb-0"><?= $user->name ?></h5>
								<div class="text-muted mb-2">@<?= $user->login ?></div>
								<?php if(!empty($user->about)): ?>
									<p><?= $user->about ?></p>
								<?php endif; ?>
							</div>
							<?php
								$contacts = new \stdClass();
								if(!empty($user->socials)) {
									$contacts->socials = $user->socials;
								}
								if(!empty($user->address)) {
									$contacts->address = $user->address;
								}
								if(!empty($user->phone)) {
									$contacts->phone = $user->phone;
								}
							?>
							<?php if(count((array)$contacts)): ?>
								<hr class="my-0">
								<div class="card-body">
									<h5 class="h6 card-title">Contacts</h5>
									<ul class="list-unstyled mb-0">
										<?php if(isset($contacts->address)): ?>
											<li class="mb-1"><i data-feather="map-pin" class="feather-sm me-1"></i> <?= $contacts->address ?></li>
										<?php endif; ?>
										<?php if(isset($contacts->phone)): ?>
											<li class="mb-1"><i data-feather="phone" class="feather-sm me-1"></i> <a href="tel:<?= $contacts->phone ?>"><?= $contacts->phone ?></a></li>
										<?php endif; ?>
										<?php if(isset($contacts->socials)): ?>
											<?php foreach($contacts->socials as $social): ?>
												<li class="mb-1"><i data-feather="link" class="feather-sm me-1"></i> <a href="<?= $social->link ?>" target="_blank"><?= ucfirst($social->type) ?></a></li>
											<?php endforeach; ?>
										<?php endif; ?>
									</ul>
								</div>
							<?php endif; ?>
						</div>
					</div>

					<div class="col-md-8 col-xl-9">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0">Activities</h5>
							</div>
							<div class="card-body h-100">
								<?php
									$notifications = $user->notifications;
									$notifications_count = $user->notifications_count;

									foreach($notifications as $notification) {
										echo getNotificationHTML($notification, $user);
									}
								?>
								<div class="d-grid">
									<a href="#" class="btn btn-primary">Load more</a>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
