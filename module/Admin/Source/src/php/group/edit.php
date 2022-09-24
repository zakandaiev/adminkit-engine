<?php
	$page->title = __('Edit group');
	Breadcrumb::add(__('Groups'), '/admin/group');
	Breadcrumb::add(__('Edit'));
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
						<form action="<?= Form::edit('Group/Group', $group->id); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/group">
							<div class="mb-3">
								<label class="form-label"><?= __('Name') ?></label>
								<input type="text" name="name" value="<?= $group->name ?>" placeholder="<?= __('Name') ?>" class="form-control" minlength="2" maxlength="200" required>
							</div>
							<div class="mb-3">
								<label class="form-label"><?= __('Routes') ?></label>
								<select name="routes[]" multiple data-placeholder="<?= __('Routes') ?>">
									<option data-placeholder></option>
									<?php foreach($routes as $method => $routes_array): ?>
										<optgroup label="<?= $method ?>">
											<?php sort($routes_array, SORT_NATURAL); ?>
											<?php foreach($routes_array as $route): ?>
												<?php
													$selected_route = '';

													if(isset($group->routes->{$method}) && in_array($route, $group->routes->{$method})) {
														$selected_route = 'selected';
													}
												?>
												<option value="<?= $method ?>@<?= $route ?>" <?= $selected_route ?>><?= $route ?></option>
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
										<?php
											$selected_user = '';

											if(in_array($user->id, $group->users)) {
												$selected_user = 'selected';
											}
										?>
										<option value="<?= $user->id ?>" <?= $selected_user ?>><?= $user->nicename ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="access_all" name="access_all" <?php if($group->access_all): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="access_all"><?= __('Access all') ?></label>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" <?php if($group->is_enabled): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="is_enabled"><?= __('Active') ?></label>
							</div>
							<button type="submit" class="btn btn-primary"><?= __('Edit group') ?></button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
