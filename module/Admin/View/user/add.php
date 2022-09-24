<?php
	$page->title = __('Add user');
	Breadcrumb::add(__('Users'), '/admin/user');
	Breadcrumb::add(__('Add'));
?>

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
						<form action="<?= Form::add('User/User'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/user" data-focus>
							<div class="mb-3">
								<label class="form-label"><?= __('Groups') ?></label>
								<select name="group[]" multiple data-placeholder="<?= __('Groups') ?>">
									<option data-placeholder></option>
									<?php foreach($groups as $group): ?>
										<option value="<?= $group->id ?>"><?= $group->name ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="row">
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Login') ?></label>
									<input type="text" name="login" placeholder="<?= __('Login') ?>" class="form-control" minlength="2" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Password') ?></label>
									<input type="text" name="password" placeholder="<?= __('Password') ?>" class="form-control" minlength="8" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Email') ?></label>
									<input type="text" name="email" placeholder="<?= __('Email') ?>" class="form-control" minlength="6" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Phone') ?></label>
									<input type="tel" data-mask="tel" placeholder="<?= __('Phone') ?>" class="form-control" minlength="8" maxlength="100">
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Name') ?></label>
									<input type="text" name="name" placeholder="<?= __('Name') ?>" class="form-control" minlength="1" maxlength="200" required>
								</div>
								<div class="col-md-6 mb-3">
									<label class="form-label"><?= __('Birthday') ?></label>
									<input type="date" name="birthday" placeholder="<?= __('Birthday') ?>" class="form-control">
								</div>
								<div class="col-xs-12 mb-3">
									<label class="form-label"><?= __('Address') ?></label>
									<input type="text" name="address" placeholder="<?= __('Address') ?>" class="form-control" minlength="2" maxlength="200">
								</div>
								<div class="col-xs-12 mb-3">
									<?= Theme::block('form-socials') ?>
								</div>
								<div class="col-md-6 mb-3 d-flex flex-column">
									<label class="form-label"><?= __('About') ?></label>
									<textarea name="about" placeholder="<?= __('About') ?>" class="form-control flex-grow-1"></textarea>
								</div>
								<div class="col-md-6 mb-3 filepond--no-grid">
									<label class="form-label"><?= __('Avatar') ?></label>
									<input type="file" accept="image/*" name="avatar">
								</div>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked>
								<label class="form-check-label" for="is_enabled"><?= __('Active') ?></label>
							</div>
							<button type="submit" class="btn btn-primary"><?= __('Add user') ?></button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
