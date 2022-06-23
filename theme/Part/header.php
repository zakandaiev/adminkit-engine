<!DOCTYPE html>
<html lang="<?= site('language_current') ?>">

<head>
	<?= Meta::all($page) ?>
	<?= Asset::render('css') ?>
	<?= Asset::render('js') ?>
</head>

<body>
	<header id="header">
		<div id="nav">
			<div id="nav-top">
				<div class="container">
					<?php Theme::menu('socials'); ?>
					<div class="nav-logo">
						<a href="<?= site('url_language') ?>" class="logo"><img src="<?= site('url') ?>/<?= site('logo_public') ?>" alt=""></a>
					</div>
					<div class="nav-btns">
						<button class="aside-btn"><i class="fa fa-bars"></i></button>
						<button class="search-btn"><i class="fa fa-search"></i></button>
						<div id="nav-search">
							<form>
								<input class="input" name="search" placeholder="<?= __('Enter your search') ?>...">
							</form>
							<button class="nav-close search-close">
								<span></span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<?php Theme::menu('header'); ?>

			<div id="nav-aside">
				<?php Theme::menu('header', ['aside' => true]); ?>
				<button class="nav-close nav-aside-close"><span></span></button>
			</div>
		</div>
	</header>
