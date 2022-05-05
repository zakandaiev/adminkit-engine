<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

			<h1 class="h3 mb-3">
					<?= __('Users') ?>
					<i data-feather="arrow-right"></i>
					<?= __('Add') ?>
				</h1>

				<div class="card">
					<div class="card-body">
						<form action="<?= Form::add('User'); ?>" method="POST" data-redirect="/admin/user">
							<div class="mb-3">
								<label class="form-label">Groups</label>
								<select name="group[]" multiple data-placeholder="Groups">
									<option data-placeholder="true"></option>
									<?php foreach($groups as $group): ?>
										<option value="<?= $group->id ?>"><?= $group->name ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="row">
								<div class="col-md-6 mb-3">
									<label class="form-label">Login</label>
									<input type="text" name="login" placeholder="Login" class="form-control" minlength="2" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Password</label>
									<input type="text" name="password" placeholder="Password" class="form-control" minlength="8" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Email</label>
									<input type="text" name="email" placeholder="Email" class="form-control" minlength="6" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Phone</label>
									<input type="text" name="phone" placeholder="Phone" class="form-control" minlength="8" maxlength="100">
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Name</label>
									<input type="text" name="name" placeholder="Name" class="form-control" minlength="1" maxlength="200">
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label">Socials</label>
									<div class="modal fade foreign-form" data-name="socials">
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
									<input type="file" accept="image/*" name="avatar">
								</div>
							</div>
							<div class="mb-3">
								<label class="form-label">Address</label>
								<input type="text" name="address" placeholder="Address" class="form-control" minlength="2" maxlength="200">
							</div>
							<div class="mb-3">
								<label class="form-label">Biography</label>
								<textarea name="biography" placeholder="Biography" class="form-control"></textarea>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="enabled" name="enabled" checked>
								<label class="form-check-label" for="enabled">Active</label>
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
