<?php Theme::header(); ?>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<?php if(!empty(Setting::get('site')->logo)): ?>
							<img class="w-50 mb-3" src="<?= Asset::path() ?>/<?= Setting::get('site')->logo ?>" alt="<?= __('auth', 'placeholder/logo') ?>">
						<?php endif; ?>
						<h1 class="h2"><?= Setting::get('site')->name ?></h1>
						<p class="lead"><?= __('auth', 'title/login') ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<div class="m-sm-4">
								<form method="POST" data-redirect="/admin">
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/login_or_email') ?></label>
										<input class="form-control form-control-lg" type="text" name="login" placeholder="<?= __('auth', 'placeholder/login_or_email') ?>" required minlength="2" maxlength="100">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/password') ?></label>
										<input class="form-control form-control-lg" type="password" name="password" placeholder="<?= __('auth', 'placeholder/password') ?>" required minlength="8" maxlength="200">
										<small>
											<?php if(Setting::get('main')->enable_registration == 'true'): ?>
												<a href="/admin/register"><?= __('auth', 'button/register') ?></a> •
											<?php endif; ?>
											<a href="/admin/reset-password"><?= __('auth', 'button/forgot') ?></a>
										</small>
									</div>
									<div class="text-center mt-3">
										<button type="submit" class="btn btn-lg btn-primary"><?= __('auth', 'button/login') ?></button>
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
