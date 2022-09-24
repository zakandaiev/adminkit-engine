<?php
	$page->title = __('Add group');
	Breadcrumb::add(__('Groups'), '/admin/group');
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
						<form action="<?= Form::add('Group/Group'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/group" data-focus>
							<div class="mb-3">
								<label class="form-label"><?= __('Name') ?></label>
								<input type="text" name="name" placeholder="<?= __('Name') ?>" class="form-control" minlength="2" maxlength="200" required>
							</div>
							<div class="mb-3">
								<label class="form-label"><?= __('Routes') ?></label>
								<select name="routes[]" multiple data-placeholder="<?= __('Routes') ?>">
									<option data-placeholder></option>
									<?php foreach($routes as $method => $routes_array): ?>
										<optgroup label="<?= $method ?>">
											<?php sort($routes_array, SORT_NATURAL); ?>
											<?php foreach($routes_array as $route): ?>
												<option value="<?= $method ?>@<?= $route ?>"><?= $route ?></option>
											<?php endforeach; ?>
										</optgroup>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="mb-3">
								<label class="form-label"><?= __('Users') ?></label>
								<select name="users[]" multiple data-placeholder="<?= __('Users') ?>">
									<option data-placeholder></option>
									<?php foreach($users as $user): ?>
										<option value="<?= $user->id ?>"><?= $user->nicename ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="access_all" name="access_all">
								<label class="form-check-label" for="access_all"><?= __('Access all') ?></label>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked>
								<label class="form-check-label" for="is_enabled"><?= __('Active') ?></label>
							</div>
							<button type="submit" class="btn btn-primary"><?= __('Add group') ?></button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
