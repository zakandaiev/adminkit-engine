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

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<div class="mb-3">
										<label class="form-label">Address</label>
										<input type="text" name="address" placeholder="Address" value="<?= $settings->address ?>" class="form-control">
									</div>
									<div class="row">
										<div class="col-md-6">
											<div class="form-group mb-3">
												<label class="form-label">Coordinate X</label>
												<input type="text" name="coordinate_x" placeholder="Coordinate X" value="<?= $settings->coordinate_x ?>" class="form-control">
											</div>
										</div>
										<div class="col-md-6">
											<div class="form-group mb-3">
												<label class="form-label">Coordinate Y</label>
												<input type="text" name="coordinate_y" placeholder="Coordinate Y" value="<?= $settings->coordinate_y ?>" class="form-control">
											</div>
										</div>
									</div>
									<div class="mb-3">
										<label class="form-label">Work hours</label>
										<input type="text" name="hours" placeholder="Work hours" value="<?= $settings->hours ?>" class="form-control">
									</div>
									<div class="mb-3">
										<label class="form-label">Email</label>
										<input type="text" name="email" placeholder="Email" value="<?= $settings->email ?>" class="form-control" required>
									</div>
									<button type="submit" class="btn btn-primary">Submit</button>
								</form>
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
