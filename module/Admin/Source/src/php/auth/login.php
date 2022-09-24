<?php Theme::header(); ?>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<?php if(!empty(site('logo_admin'))): ?>
							<img class="w-25 mb-3" src="<?= site('url') ?>/<?= site('logo_admin') ?>" alt="Logo">
						<?php else: ?>
							<h1 class="h2"><?= site('name') ?></h1>
						<?php endif; ?>
						<p class="lead"><?= __('Sign in to continue') ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<?php Theme::widget('lang'); ?>
							<div class="m-sm-4">
								<form action="<?= Form::add('Auth/Login'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin" data-focus>
									<div class="mb-3">
										<label class="form-label"><?= __('Login or email') ?></label>
										<input class="form-control form-control-lg" type="text" name="login" placeholder="<?= __('Enter your login or email') ?>" required minlength="2" maxlength="100">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Password') ?></label>
										<input class="form-control form-control-lg" type="password" name="password" placeholder="<?= __('Enter your password') ?>" required minlength="8" maxlength="200">
										<small>
											<?php if(site('enable_registration')): ?>
												<a href="<?= site('url_language') ?>/admin/register"><?= __('Register') ?></a>
											<?php endif; ?>
											<?php if(site('enable_password_restore')): ?>
												<a href="<?= site('url_language') ?>/admin/reset-password"><?= __('Forgot password') ?></a>
											<?php endif; ?>
										</small>
									</div>
									<div class="text-center mt-3">
										<button type="submit" class="btn btn-lg btn-primary"><?= __('Login') ?></button>
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
