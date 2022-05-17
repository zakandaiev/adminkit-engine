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
						<a href="/admin/profile" class="btn btn-primary">Back to profile</a>
					</div>
				</div>

				<div class="row">
					<div class="col-md-3">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0">Profile Settings</h5>
							</div>
							<div class="list-group list-group-flush" role="tablist">
								<a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account" role="tab">
									Account
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#password" role="tab">
									Password
								</a>
								<!-- <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
									Privacy and safety
								</a> -->
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
									Email notifications
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
									Web notifications
								</a>
								<a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#" role="tab">
									Delete account
								</a>
							</div>
						</div>
					</div>
					<div class="col-md-9">
						<div class="tab-content">
							<div class="tab-pane fade show active" id="account" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0">Main</h5>
									</div>
									<div class="card-body">
										<form action="<?= Form::edit('Profile/Account_Main', $user->id); ?>" method="POST">
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
												<div class="col-md-4 filepond--no-grid">
													<label class="form-label"><?= __('Avatar') ?></label>
													<input type="file" accept="image/*" name="avatar" data-value='<?= Form::populateFiles($user->avatar) ?>'>
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
										<form action="<?= Form::edit('Profile/Account_Contacts', $user->id); ?>" method="POST">
											<div class="mb-3">
												<label class="form-label"><?= __('Socials') ?></label>
												<div class="modal fade foreign-form" data-name="socials" data-value='<?= json_encode($user->socials) ?>'>
													<div class="modal-dialog modal-dialog-centered">
														<div class="modal-content">
															<div class="modal-header">
																<h5 class="modal-title"><?= __('Add social') ?></h5>
																<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
															</div>
															<div class="modal-body">
																<div class="mb-3">
																	<label class="form-label"><?= __('Social') ?></label>
																	<select name="type" data-placeholder="<?= __('Social') ?>">
																		<?php foreach(site('socials_allowed') as $social): ?>
																			<option value="<?= strtolower($social) ?>"><?= ucfirst($social) ?></option>
																		<?php endforeach; ?>
																	</select>
																</div>
																<div class="mb-3">
																	<label class="form-label"><?= __('Link') ?></label>
																	<input type="url" name="link" placeholder="<?= __('Link') ?>" class="form-control" minlength="1" maxlength="200">
																</div>
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= __('Cancel') ?></button>
																<button type="submit" class="btn btn-primary" data-bs-dismiss="modal"><?= __('Add') ?></button>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('Phone') ?></label>
												<input type="text" name="phone" placeholder="<?= __('Phone') ?>" value="<?= $user->phone ?>" class="form-control" minlength="8" maxlength="100">
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('Address') ?></label>
												<input type="text" name="address" placeholder="<?= __('Address') ?>" value="<?= $user->address ?>" class="form-control" minlength="2" maxlength="200">
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('About') ?></label>
												<textarea name="about" placeholder="<?= __('About') ?>" class="form-control"><?= $user->about ?></textarea>
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
						</div>
					</div>
				</div>
			</div>
		</main>
		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
