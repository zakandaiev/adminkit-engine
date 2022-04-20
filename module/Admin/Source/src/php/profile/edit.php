<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">
				<div class="row mb-3">
					<div class="col-auto">
						<h1 class="h3 d-inline align-middle">Profile <i data-feather="arrow-right"></i> Edit</h1>
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
										<form action="<?php Form::edit('Profile/Account_Main', $user->id); ?>" method="POST">
											<div class="row">
												<div class="col-md-8">
													<div class="mb-3">
														<label class="form-label"><?= __('form_user', 'login/label') ?></label>
														<div class="input-group mb-3">
															<div class="input-group-text">@</div>
															<input type="text" name="login" placeholder="<?= __('form_user', 'login/placeholder') ?>" value="<?= $user->login ?>" class="form-control" minlength="2" maxlength="200" required>
														</div>
													</div>
													<div class="mb-3">
														<label class="form-label"><?= __('form_user', 'email/label') ?></label>
														<input type="text" name="email" placeholder="<?= __('form_user', 'email/placeholder') ?>" value="<?= $user->email ?>" class="form-control" minlength="6" maxlength="200" required>
													</div>
													<div class="mb-3">
														<label class="form-label"><?= __('form_user', 'name/label') ?></label>
														<input type="text" name="name" placeholder="<?= __('form_user', 'name/placeholder') ?>" value="<?= $user->name ?>" class="form-control" minlength="1" maxlength="200" required>
													</div>
												</div>
												<div class="col-md-4 filepond--no-grid">
													<label class="form-label"><?= __('form_user', 'avatar/label') ?></label>
													<input type="file" accept="image/*" name="avatar" data-value='<?php Form::populateFiles($user->avatar) ?>'>
												</div>
											</div>
											<button type="submit" class="btn btn-primary">Save changes</button>
										</form>
									</div>
								</div>
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0">Contacts</h5>
									</div>
									<div class="card-body">
										<form action="<?php Form::edit('Profile/Account_Contacts', $user->id); ?>" method="POST">
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'socials/label') ?></label>
												<div class="modal fade foreign-form" data-name="socials" data-value='<?= json_encode($user->socials) ?>'>
													<div class="modal-dialog modal-dialog-centered">
														<div class="modal-content">
															<div class="modal-header">
																<h5 class="modal-title"><?= __('form_user', 'socials/modal') ?></h5>
																<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
															</div>
															<div class="modal-body">
																<div class="mb-3">
																	<label class="form-label"><?= __('form_user', 'socials/social') ?></label>
																	<select name="type" data-placeholder="<?= __('form_user', 'socials/social') ?>">
																		<?php
																			$socials = Setting::get('main')->socials_allowed;
																			$socials = json_decode($socials) ?? [];
																		?>
																		<?php foreach($socials as $social): ?>
																			<option value="<?= strtolower($social) ?>"><?= ucfirst($social) ?></option>
																		<?php endforeach; ?>
																	</select>
																</div>
																<div class="mb-3">
																	<label class="form-label"><?= __('form_user', 'socials/link') ?></label>
																	<input type="url" name="link" placeholder="<?= __('form_user', 'socials/link') ?>" class="form-control" minlength="1" maxlength="200">
																</div>
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= __('form_user', 'socials/cancel') ?></button>
																<button type="submit" class="btn btn-primary" data-bs-dismiss="modal"><?= __('form_user', 'socials/add') ?></button>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'phone/label') ?></label>
												<input type="text" name="phone" placeholder="<?= __('form_user', 'phone/placeholder') ?>" value="<?= $user->phone ?>" class="form-control" minlength="8" maxlength="100">
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'address/label') ?></label>
												<input type="text" name="address" placeholder="<?= __('form_user', 'address/placeholder') ?>" value="<?= $user->address ?>" class="form-control" minlength="2" maxlength="200">
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'about/label') ?></label>
												<textarea name="about" placeholder="<?= __('form_user', 'about/placeholder') ?>" class="form-control"><?= $user->about ?></textarea>
											</div>
											<button type="submit" class="btn btn-primary">Save changes</button>
										</form>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="password" role="tabpanel">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0">Password</h5>
									</div>
									<div class="card-body">
										<form action="<?php Form::edit('Profile/Password', $user->id); ?>" method="POST">
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'password_current/label') ?></label>
												<input type="password" name="password_current" placeholder="<?= __('form_user', 'password_current/placeholder') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'password_new/label') ?></label>
												<input type="password" name="password_new" placeholder="<?= __('form_user', 'password_new/placeholder') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<div class="mb-3">
												<label class="form-label"><?= __('form_user', 'password_confirm/label') ?></label>
												<input type="password" name="password_confirm" placeholder="<?= __('form_user', 'password_confirm/placeholder') ?>" class="form-control" minlength="8" maxlength="200" required>
											</div>
											<button type="submit" class="btn btn-primary">Save changes</button>
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