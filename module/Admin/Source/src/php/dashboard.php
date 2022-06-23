<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="card" style="background-image: url('/module/Admin/View/Asset/img/dashboard.png');background-size: contain;background-repeat: no-repeat;background-position: bottom;background-color: #222e3c;color: #fff;height: 280px;padding: 50px;">
				<h1 style="color: #fff;"><?= __('Welcome to') ?> <?= site('name') ?></h1>
			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
