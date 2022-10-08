<?php
	$page->title = __('Modules');
	Breadcrumb::add(__('Modules'));
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
						<?php if(!empty($modules)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th><?= __('Priority') ?></th>
										<th><?= __('Name') ?></th>
										<th><?= __('Description') ?></th>
										<th><?= __('Version') ?></th>
										<th><?= __('Active') ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($modules as $module): ?>
										<tr>
											<td>
												<?php if(isset($module['priority'])): ?>
													<?= $module['priority'] ?>
												<?php else: ?>
													<i class="align-middle" data-feather="minus"></i>
												<?php endif; ?>
											</td>
											<td><?= $module['name'] ?></td>
											<td>
												<?php if(strlen($module['description']) > 50): ?>
													<span data-bs-toggle="tooltip" title="<?= html($module['description']) ?>"><?= html(excerpt($module['description'], 50)) ?></span>
												<?php else: ?>
													<?= html($module['description']) ?>
												<?php endif; ?>
											</td>
											<td>v<?= $module['version'] ?></td>
											<td>
												<?php
													$enabled_title = $module['is_enabled'] ? __('Disable this module') : __('Enable this module');
												?>
												<a href="#" data-action="<?= site('url_language') ?>/admin/module/toggle/<?= $module['name'] ?>" data-fields='[{"key":"is_enabled","value":"<?= $module['is_enabled'] ?>"}]' data-redirect="this" title="<?= $enabled_title ?>" data-bs-toggle="tooltip">
													<?= icon_boolean($module['is_enabled']) ?>
											</td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/module/edit/' . $module['name'];
													$delete = [
														'data-action' => site('url') . '/admin/module/delete/' . $module['name'],
														'data-confirm' => __('Delete module') . ' ' . $module['name'] . '?',
														'data-delete' => 'trow',
														'data-counter' => '#pagination-counter'
													];
													echo table_actions($edit_url, $delete);
												?>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0"><?= __('There are not modules yet') ?></h5>
						<?php endif; ?>
						<div class="mt-4">
							<div class="row">
								<div class="col-sm-12 col-md-5">
									<output class="align-middle"><?= __('Total') ?>: <span id="pagination-counter"><?= count($modules) ?></span></output>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
