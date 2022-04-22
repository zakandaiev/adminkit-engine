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
						<p class="lead"><?= __('auth', 'title/register') ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<div class="m-sm-4">
								<form method="POST" data-redirect="/admin/profile">
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/name') ?></label>
										<input class="form-control form-control-lg" type="text" name="name" placeholder="<?= __('auth', 'placeholder/name') ?>" required minlength="1" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/login') ?></label>
										<input class="form-control form-control-lg" type="text" name="login" placeholder="<?= __('auth', 'placeholder/login') ?>" required minlength="2" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/email') ?></label>
										<input class="form-control form-control-lg" type="email" name="email" placeholder="<?= __('auth', 'placeholder/email') ?>" required minlength="6" maxlength="200">
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('auth', 'field/password') ?></label>
										<input class="form-control form-control-lg" type="password" name="password" placeholder="<?= __('auth', 'placeholder/password') ?>" required minlength="8" maxlength="200">
										<small>
											<a href="/admin/login"><?= __('auth', 'button/login') ?></a> •
											<a href="/admin/reset-password"><?= __('auth', 'button/forgot') ?></a>
										</small>
									</div>
									<div class="text-center mt-3">
										<button type="submit" class="btn btn-lg btn-primary"><?= __('auth', 'button/register') ?></button>
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
