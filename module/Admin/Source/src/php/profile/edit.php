<?php
	$page->title = __('Edit profile');
	Breadcrumb::add(__('Profile'), '/admin/profile');
	Breadcrumb::add(__('Edit'));
?>

<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">
				<div class="row mb-3">
					<div class="col-auto">
						<?= Breadcrumb::render() ?>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="<?= site('url_language') ?>/admin/profile" class="btn btn-primary"><?= __('Back to profile') ?></a>
					</div>
				</div>

				<div class="row">
					<div class="col-md-3">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0"><?= __('Profile settings') ?></h5>
							</div>
							<div class="list-group list-group-flush" role="tablist">
								<a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account" role="tab">
									<?= __('Account') ?>
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#password" role="tab">
									<?= __('Password') ?>
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#notifications" role="tab">
									<?= __('Notifications') ?>
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#delete-account" role="tab">
									<?= __('Delete account') ?>
								</a>
							</div>
						</div>
					</div>
					<div class="col-md-9">
						<div class="tab-content">
							<div class="tab-pane fade show active" id="account" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Main') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Main', $user->id); ?>" method="POST">
											<div class="row">
												<div class="col-md-8">
													<div class="mb-3">
														<label class="form-label"><?= __('Login') ?></label>
														<div class="input-group mb-3">
															<div class="input-group-text">@</div>
															<input type="text" name="login" placeholder="<?= __('login') ?>" value="<?= $user->login ?>" class="form-control" minlength="2" maxlength="200" required>
														</div>
													</div>
													<div class="mb-3">
														<label class="form-label"><?= __('Email') ?></label>
														<input type="text" name="email" placeholder="<?= __('Email') ?>" value="<?= $user->email ?>" class="form-control" minlength="6" maxlength="200" required>
													</div>
													<div class="mb-3">
														<label class="form-label"><?= __('Name') ?></label>
														<input type="text" name="name" placeholder="<?= __('Name') ?>" value="<?= $user->name ?>" class="form-control" minlength="1" maxlength="200" required>
													</div>
												</div>
												<div class="col-md-4">
													<div class="mb-3 filepond--no-grid">
														<label class="form-label"><?= __('Avatar') ?></label>
														<input type="file" accept="image/*" name="avatar" data-value='<?= Form::populateFiles($user->avatar) ?>'>
													</div>
												</div>
											</div>
											<button type="submit" class="btn btn-primary"><?= __('Save changes') ?></button>
										</form>
									</div>
								</div>
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Contacts') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Contacts', $user->id); ?>" method="POST">
											<div class="row">
												<div class="col-xs-12 col-md-6">
													<div class="mb-3">
														<label class="form-label"><?= __('Phone') ?></label>
														<input type="tel" data-mask="tel" placeholder="<?= __('Phone') ?>" value="<?= $user->phone ?>" class="form-control" minlength="8" maxlength="100">
													</div>
												</div>
												<div class="col-xs-12 col-md-6">
													<div class="mb-3">
														<label class="form-label"><?= __('Birthday') ?></label>
														<input type="date" name="birthday" placeholder="<?= __('Birthday') ?>" value="<?= $user->birthday ?>" class="form-control">
													</div>
												</div>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('Address') ?></label>
												<input type="text" name="address" placeholder="<?= __('Address') ?>" value="<?= $user->address ?>" class="form-control" minlength="2" maxlength="200">
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('About') ?></label>
												<textarea name="about" placeholder="<?= __('About') ?>" class="form-control"><?= $user->about ?></textarea>
											</div>
											<div class="mb-3">
												<?= Theme::block('form-socials', ['value' => $user->socials]) ?>
											</div>
											<button type="submit" class="btn btn-primary"><?= __('Save changes') ?></button>
										</form>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="password" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Password') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Password', $user->id); ?>" method="POST" data-reset>
											<div class="mb-3">
												<label class="form-label"><?= __('Current password') ?></label>
												<input type="password" name="password_current" placeholder="<?= __('Current password') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('New password') ?></label>
												<input type="password" name="password_new" placeholder="<?= __('New password') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('Confirm password') ?></label>
												<input type="password" name="password_confirm" placeholder="<?= __('Confirm password') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<button type="submit" class="btn btn-primary"><?= __('Save changes') ?></button>
										</form>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="notifications" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Web notifications') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Notifications_Web', $user->id); ?>" method="POST">
											<?php foreach($GLOBALS['admin_notification'] as $key => $notification): ?>
												<?php
													$key = "web_$key";
													if(isset($notification['user_can_manage']) && $notification['user_can_manage'] == false) continue;
													if(isset($notification['type']) && !str_contains($notification['type'], 'web')) continue;
												?>
												<div class="form-check form-switch mb-3">
													<input class="form-check-input" type="checkbox" id="<?= $key ?>" name="<?= $key ?>" <?php if(@$user->setting->notifications->$key !== false): ?>checked<?php endif; ?>>
													<label class="form-check-label" for="<?= $key ?>"><?= $notification['name'] ?></label>
												</div>
											<?php endforeach; ?>
											<button type="submit" class="btn btn-primary"><?= __('Save changes') ?></button>
										</form>
									</div>
								</div>
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Email notifications') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Notifications_Email', $user->id); ?>" method="POST">
											<?php foreach($GLOBALS['admin_notification'] as $key => $notification): ?>
												<?php
													$key = "mail_$key";
													if(isset($notification['user_can_manage']) && $notification['user_can_manage'] == false) continue;
													if(isset($notification['type']) && !str_contains($notification['type'], 'mail')) continue;
												?>
												<div class="form-check form-switch mb-3">
													<input class="form-check-input" type="checkbox" id="<?= $key ?>" name="<?= $key ?>" <?php if(@$user->setting->notifications->$key !== false): ?>checked<?php endif; ?>>
													<label class="form-check-label" for="<?= $key ?>"><?= $notification['name'] ?></label>
												</div>
											<?php endforeach; ?>
											<button type="submit" class="btn btn-primary"><?= __('Save changes') ?></button>
										</form>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="delete-account" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0"><?= __('Delete account') ?></h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Delete', $user->id); ?>" data-confirm="<?= __('Are you sure you want delete the account?') ?>" data-redirect="<?= site('url_language') ?>/admin" method="POST">
											<div class="mb-3">
												<label class="form-label"><?= __('Enter your password to continue') ?></label>
												<input type="password" name="password" placeholder="<?= __('Enter your password to continue') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<button type="submit" class="btn btn-danger"><?= __('Delete account') ?></button>
										</form>
									</div>
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
