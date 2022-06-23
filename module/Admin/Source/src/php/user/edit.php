<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

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
									<label class="form-label"><?= __('Birthday') ?></label>
									<input type="date" name="birthday" placeholder="<?= __('Birthday') ?>" value="<?= $user->birthday ?>" class="form-control">
								</div>
								<div class="col-xs-12 mb-3">
									<label class="form-label">Address</label>
									<input type="text" name="address" placeholder="Address" value="<?= $user->address ?>" class="form-control" minlength="2" maxlength="200">
								</div>
								<div class="col-xs-12 mb-3">
									<?= Theme::block('form-socials', ['value' => $user->socials]) ?>
								</div>
								<div class="col-md-6 mb-3 d-flex flex-column">
									<label class="form-label">About</label>
									<textarea name="about" placeholder="About" class="form-control flex-grow-1"><?= $user->about ?></textarea>
								</div>
								<div class="col-md-6 mb-3 filepond--no-grid">
									<label class="form-label">Avatar</label>
									<input type="file" accept="image/*" name="avatar" data-value='<?= Form::populateFiles($user->avatar) ?>'>
								</div>
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
