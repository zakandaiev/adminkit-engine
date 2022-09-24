<?php
	$page->title = __('Logs');
	Breadcrumb::add(__('Logs'), '/admin/log');
	$log_name = explode('/', $log->name);
	foreach($log_name as $key => $name) {
		Breadcrumb::add($name);
	}
?>

<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?= Breadcrumb::render() ?>
				</div>

				<div class="card">
					<div class="card-body">
						<div class="log__body m-0"><?= format_log($log->body) ?></div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
