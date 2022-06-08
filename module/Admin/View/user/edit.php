<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?= Breadcrumb::render() ?>
				</div>

				<div class="card">
					<div class="card-body">
						<form action="<?= Form::edit('User', $user->id); ?>" method="POST" data-redirect="/admin/user">
							<div class="mb-3">
								<label class="form-label">Groups</label>
								<select name="group[]" multiple data-placeholder="Groups">
									<option data-placeholder="true"></option>
									<?php foreach($groups as $group): ?>
										<?php
											$selected_group = '';

											if(in_array($group->id, $user->groups)) {
												$selected_group = 'selected';
											}
										?>
										<option value="<?= $group->id ?>" <?= $selected_group ?>><?= $group->name ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="row">
								<div class="col-md-6 mb-3">
									<label class="form-label">Login</label>
									<input type="text" name="login" placeholder="Login" value="<?= $user->login ?>" class="form-control" minlength="2" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Password</label>
									<input type="text" name="password" placeholder="Create new password" class="form-control" minlength="8" maxlength="200">
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Email</label>
									<input type="text" name="email" placeholder="Email" value="<?= $user->email ?>" class="form-control" minlength="6" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Phone</label>
									<input type="text" name="phone" placeholder="Phone" value="<?= $user->phone ?>" class="form-control" minlength="8" maxlength="100">
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Name</label>
									<input type="text" name="name" placeholder="Name" value="<?= $user->name ?>" class="form-control" minlength="1" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Socials</label>
									<div class="modal fade foreign-form" data-name="socials" data-value='<?= $user->socials ?>'>
										<div class="modal-dialog modal-dialog-centered">
											<div class="modal-content">
												<div class="modal-header">
													<h5 class="modal-title">Add social</h5>
													<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
												</div>
												<div class="modal-body">
													<div class="mb-3">
														<label class="form-label">Social</label>
														<select name="type" data-placeholder="Social">
															<?php foreach(site('socials_allowed') as $social): ?>
																<option value="<?= strtolower($social) ?>"><?= ucfirst($social) ?></option>
															<?php endforeach; ?>
														</select>
													</div>
													<div class="mb-3">
														<label class="form-label">Link</label>
														<input type="url" name="link" placeholder="Link" class="form-control" minlength="1" maxlength="200">
													</div>
												</div>
												<div class="modal-footer">
													<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
													<button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-6 mb-3 filepond--no-grid">
									<label class="form-label">Avatar</label>
									<input type="file" accept="image/*" name="avatar" data-value='<?= Form::populateFiles($user->avatar) ?>'>
								</div>
							</div>
							<div class="mb-3">
								<label class="form-label">Address</label>
								<input type="text" name="address" placeholder="Address" value="<?= $user->address ?>" class="form-control" minlength="2" maxlength="200">
							</div>
							<div class="mb-3">
								<label class="form-label">About</label>
								<textarea name="about" placeholder="About" class="form-control"><?= $user->about ?></textarea>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" <?php if($user->is_enabled): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="is_enabled">Active</label>
							</div>
							<button type="submit" class="btn btn-primary">Submit</button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
