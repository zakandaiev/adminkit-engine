<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">
				<div class="row mb-3">
					<div class="col-auto">
						<h1 class="h3 d-inline align-middle">Profile</h1>
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
								<img src="<?= Asset::url() ?>/img/no_avatar.jpg" alt="<?= $user->name ?>" class="img-fluid rounded-circle mb-2" width="128" height="128" data-fancybox>
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
								<div class="d-flex align-items-start">
									<img src="<?= Asset::url() ?>/img/no_avatar.jpg" width="36" height="36" class="rounded-circle me-2" alt="<?= $user->name ?>">
									<div class="flex-grow-1">
										<small class="float-end text-navy">5m ago</small>
										<strong><?= $user->name ?> (@<?= $user->login ?>)</strong> replied to your comment on <a href="#"><strong>New</strong></a>
										<div class="border text-sm text-muted p-2 mt-1">
											Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem
											neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante
											tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.
										</div>
									</div>
								</div>
								<hr>
								<div class="d-flex align-items-start">
									<img src="<?= Asset::url() ?>/img/no_avatar.jpg" width="36" height="36" class="rounded-circle me-2" alt="You">
									<div class="flex-grow-1">
										<small class="float-end text-navy">5m ago</small>
										<strong>You</strong> leaved comment on <a href="#"><strong>News</strong></a>
										<div class="border text-sm text-muted p-2 mt-1">
											Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem
											neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante
											tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.
										</div>
									</div>
								</div>
								<hr>
								<div class="d-flex align-items-start">
									<img src="<?= Asset::url() ?>/img/no_avatar.jpg" width="36" height="36" class="rounded-circle me-2" alt="You">
									<div class="flex-grow-1">
										<small class="float-end text-navy">5m ago</small>
										<strong>You</strong> posted <a href="#"><strong>New</strong></a>
										<div class="row g-0 mt-1">
											<div class="col-6 col-md-4 col-lg-4 col-xl-3">
												<img src="http://localhost:3000/module/Admin/Asset/img/no_image.jpg" class="img-fluid pe-2" alt="Unsplash" data-fancybox>
											</div>
										</div>
									</div>
								</div>
								<hr>
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