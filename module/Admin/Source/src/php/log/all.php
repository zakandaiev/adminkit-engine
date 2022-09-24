<?php
	$page->title = __('Logs');
	Breadcrumb::add(__('Logs'));
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
						<?php if(!empty($logs)): ?>
							<table class="table table-sm m-0">
								<tbody>
									<tr>
										<td>
											<?= logs($logs); ?>
										</td>
									</tr>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0"><?= __('There are not logs yet') ?></h5>
						<?php endif; ?>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
