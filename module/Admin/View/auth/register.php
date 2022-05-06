<?php Theme::header(); ?>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<?php if(!empty(site('logo'))): ?>
							<img class="w-50 mb-3" src="<?= Asset::path() ?>/<?= site('logo') ?>" alt="Logo">
						<?php endif; ?>
						<h1 class="h2"><?= site('name') ?></h1>
						<p class="lead"><?= __('Get started') ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<div class="m-sm-4">
								<form action="<?= Form::add('Auth/Register'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/profile">
									<div class="mb-3">
										<label class="form-label"><?= __('Name') ?></label>
										<input class="form-control form-control-lg" type="text" name="name" placeholder="<?= __('Enter your name') ?>" required minlength="1" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Login') ?></label>
										<input class="form-control form-control-lg" type="text" name="login" placeholder="<?= __('Enter your login') ?>" required minlength="2" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Email') ?></label>
										<input class="form-control form-control-lg" type="email" name="email" placeholder="<?= __('Enter your email') ?>" required minlength="6" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Password') ?></label>
										<input class="form-control form-control-lg" type="password" name="password" placeholder="<?= __('Create your password') ?>" required minlength="8" maxlength="200">
										<small>
											<a href="/admin/login"><?= __('Login') ?></a> •
											<a href="/admin/reset-password"><?= __('Forgot password') ?></a>
										</small>
									</div>
									<div class="text-center mt-3">
										<button type="submit" class="btn btn-lg btn-primary"><?= __('Register') ?></button>
									</div>
								</form>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</main>

<?php Theme::footer(); ?>