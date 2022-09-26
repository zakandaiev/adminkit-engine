<?php Theme::header(); ?>

<div class="page-header">
	<div class="container">
		<div class="row">
			<div class="col-md-offset-1 col-md-10 text-center">
				<h1 class="text-uppercase"><?= $page->title ?></h1>
				<?php if(!empty($page->excerpt)): ?>
					<p class="lead"><?= $page->excerpt ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('Contact information') ?></h2>
					</div>
					<?= $page->content ?>
					<ul class="contact">
						<?php
							$phones = Menu::get('phones')->items;
							$email = site('email');
							$address = site('address');
						?>
						<?php foreach($phones as $phone): ?>
							<li><i class="fa fa-phone"></i> <a href="tel:<?= tel($phone->url) ?>"><?= $phone->name ?></a></li>
						<?php endforeach; ?>
						<?php if(!empty($email)): ?>
							<li><i class="fa fa-envelope"></i> <a href="mailto:<?= $email ?>"><?=$email ?></a></li>
						<?php endif; ?>
						<?php if(!empty($address)): ?>
							<li><i class="fa fa-map-marker"></i> <?= $address ?></li>
						<?php endif; ?>
					</ul>
				</div>

				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('Mail us') ?></h2>
					</div>
					<form action="<?= Form::add('Contact') ?>" method="POST" data-message="<?= __('Your message has been sent') ?>" data-reset>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<input class="input" type="email" name="email" minlength="2" maxlength="200" placeholder="<?= __('Email') ?>" <?php if(User::get()->authorized): ?> value="<?= User::get()->email ?>" <?php endif; ?> required>
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<input class="input" type="text" name="subject" minlength="2" maxlength="64" placeholder="<?= __('Subject') ?>">
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<textarea class="input" name="message" minlength="2" maxlength="500" placeholder="<?= __('Message') ?>" required></textarea>
								</div>
								<input type="hidden" name="<?= COOKIE_KEY['csrf'] ?>" value="<?= Request::$csrf ?>">
								<button type="submit" class="primary-button"><?= __('Submit') ?></button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="col-md-4">
				<?php Theme::widget('socials'); ?>
				<?php Theme::widget('newsletter'); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
