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
						<p class="lead"><?= __('Reset your password') ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<?php if(Request::has('success')): ?>
								<div class="text-center"><?= __('You have successfully reseted password. Check your email') ?></div>
								<div class="text-center mt-3">
									<a href="<?= site('url_language') ?>/admin/login" class="btn btn-lg btn-primary"><?= __('Back to login') ?></a>
								</div>
							<?php else: ?>
								<?php Theme::widget('lang'); ?>
								<div class="m-sm-4">
									<form action="<?= Form::add('Auth/Restore'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/reset-password?success" data-focus>
										<div class="mb-3">
											<label class="form-label"><?= __('Email') ?></label>
											<input class="form-control form-control-lg" type="email" name="email" placeholder="<?= __('Enter your email') ?>" required minlength="6" maxlength="200">
											<small>
												<a href="<?= site('url_language') ?>/admin/login"><?= __('Login') ?></a>
												<?php if(site('enable_registration')): ?>
													<a href="<?= site('url_language') ?>/admin/register"><?= __('Register') ?></a>
												<?php endif; ?>
											</small>
										</div>
										<div class="text-center mt-3">
											<button type="submit" class="btn btn-lg btn-primary"><?= __('Reset password') ?></button>
										</div>
									</form>
								</div>
							<?php endif; ?>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</main>

<?php Theme::footer(); ?>
