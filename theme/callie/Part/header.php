<!DOCTYPE html>
<html lang="<?= site('lang_current') ?>">

<head>
	<meta charset="<?= site('charset') ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title><?php Theme::title($page->title); ?></title>

	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700%7CMuli:400,700" rel="stylesheet">

	<?php Theme::meta(); ?>
	<?php Asset::render('css'); ?>

</head>

<body>
	<header id="header">
		<div id="nav">
			<div id="nav-top">
				<div class="container">
					<?php
						$menu_socials = get_menu('socials');
					?>
					<?php if(!empty($menu_socials)): ?>
						<ul class="nav-social">
							<?= menu_social_header($menu_socials); ?>
						</ul>
					<?php endif; ?>
					<div class="nav-logo">
						<a href="/" class="logo"><img src="/<?= Setting::get('site')->logo_public ?>" alt=""></a>
					</div>
					<div class="nav-btns">
						<button class="aside-btn"><i class="fa fa-bars"></i></button>
						<button class="search-btn"><i class="fa fa-search"></i></button>
						<div id="nav-search">
							<form>
								<input class="input" name="search" placeholder="Enter your search...">
							</form>
							<button class="nav-close search-close">
								<span></span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<?php
				$menu_header = get_menu('header');
			?>
			<?php if(!empty($menu_header)): ?>
				<div id="nav-bottom">
					<div class="container">
						<ul class="nav-menu">
							<?= menu($menu_header); ?>
						</ul>
					</div>
				</div>
			<?php endif; ?>

			<div id="nav-aside">
				<ul class="nav-aside-menu">
					<?php if(!empty($menu_header)): ?>
						<?= menu_aside($menu_header); ?>
					<?php endif; ?>
				</ul>
				<button class="nav-close nav-aside-close"><span></span></button>
			</div>
		</div>
	</header>
