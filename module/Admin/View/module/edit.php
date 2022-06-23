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
						<form method="POST" data-redirect="/admin/module">
							<div class="row">
								<div class="col-xs-12 col-md-6">
									<div class="mb-3">
										<label class="form-label">Order</label>
										<input type="number" name="order" value="<?= @$module['order'] ?>" placeholder="Order" class="form-control" min="0">
									</div>
								</div>
								<div class="col-xs-12 col-md-6">
									<div class="mb-3">
										<label class="form-label">Version</label>
										<input type="text" name="version" value="<?= $module['version'] ?>" placeholder="Version" class="form-control" minlength="1">
									</div>
								</div>
							</div>
							<div class="mb-3">
								<label class="form-label">Extends</label>
								<input type="text" name="extends" value="<?= @$module['extends'] ?>" placeholder="Extends" class="form-control" minlength="2" maxlength="200">
							</div>
							<div class="mb-3">
								<label class="form-label">Description</label>
								<textarea name="description" class="form-control" required><?= $module['description'] ?></textarea>
							</div>
							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" <?php if($module['is_enabled']): ?>checked<?php endif; ?>>
								<label class="form-check-label" for="is_enabled">Is enabled</label>
							</div>
							<button type="submit" class="btn btn-primary">Save</button>
						</form>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
