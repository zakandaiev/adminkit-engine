<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?php
						$log_name = explode('/', $log->name);

						foreach($log_name as $key => $name) {
							Breadcrumb::add($name);
						}

						echo Breadcrumb::render();
					?>
				</div>

				<div class="card">
					<div class="card-header">
						<h5 class="card-title mb-0">
							<?php
								$log_url = site('url') . '/log/' . $log->name . '.' . Define::LOG_EXTENSION;
								echo '<a href="' . $log_url . '" target="_blank">' . $log_url . '</a>';
							?>
						</h5>
					</div>
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
