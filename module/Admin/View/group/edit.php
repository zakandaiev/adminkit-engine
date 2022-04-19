<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3">Add group</h1>

				<div class="card">
					<div class="card-body">
						<form action="<?php Form::edit('Group', $group->id); ?>" method="POST" data-redirect="/admin/group">
							<div class="mb-3">
								<label class="form-label">Name</label>
								<input type="text" name="name" value="<?= $group->name ?>" placeholder="Name" class="form-control" minlength="2" maxlength="200" required>
							</div>
							<div class="mb-3">
								<label class="form-label">Routes</label>
								<select name="routes[]" multiple data-placeholder="Routes">
									<option data-placeholder="true"></option>
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
								<label class="form-label">Users</label>
								<select name="users[]" multiple data-placeholder="Users">
									<option data-placeholder="true"></option>
									<?php foreach($users as $user): ?>
										<?php
											$selected_user = '';

											if(in_array($user->id, $group->users)) {
												$selected_user = 'selected';
											}
										?>
										<option value="<?= $user->id ?>" <?= $selected_user ?>><?= $user->name ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="access_all" name="access_all" <?php if($group->access_all): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="access_all">Access all</label>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="enabled" name="enabled" <?php if($group->enabled): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="enabled">Enabled</label>
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