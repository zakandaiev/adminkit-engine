<?php
	$page->title = __('Groups');
	Breadcrumb::add(__('Groups'));
?>

<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="row mb-3">
					<div class="col-auto">
						<?= Breadcrumb::render() ?>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="<?= site('url_language') ?>/admin/group/add" class="btn btn-primary"><?= __('Add group') ?></a>
					</div>
				</div>

				<div class="card">
					<div class="card-body">
						<?php if(!empty($groups)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th><?= sort_link('oid', 'ID') ?></th>
										<th><?= sort_link('oname', __('Name')) ?></th>
										<th><?= sort_link('oroutes', __('Routes count')) ?></th>
										<th><?= sort_link('ousers', __('Users count')) ?></th>
										<th><?= sort_link('ocreate', __('Create date')) ?></th>
										<th><?= sort_link('oactive', __('Active')) ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($groups as $group): ?>
										<tr>
											<td><?= $group->id ?></td>
											<td><?= $group->name ?></td>
											<td>
												<?php if($group->access_all): ?>
													<?= __('Access all') ?>
												<?php else: ?>
													<?= $group->count_routes ?>
												<?php endif; ?>
											</td>
											<td><a href="<?= site('url_language') ?>/admin/user"><?= $group->count_users ?></a></td>
											<td title="<?= format_date($group->date_created) ?>"><?= date_when($group->date_created) ?></td>
											<td>
												<?php
													$enabled_title = $group->is_enabled ? __('Deactivate this group') : __('Activate this group');
												?>
												<a href="#" data-action="<?= Form::edit('Group/ToggleEnable', $group->id) ?>" data-fields='[{"key":"is_enabled","value":<?= $group->is_enabled ?>}]' data-redirect="this" title="<?= $enabled_title ?>" data-bs-toggle="tooltip">
													<?= icon_boolean($group->is_enabled) ?>
												</a>
											</td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/group/edit/' . $group->id;
													$delete = [
														'data-action' => Form::delete('Group/Group', $group->id),
														'data-confirm' => __('Delete') . ' ' . $group->name . '?',
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
							<h5 class="card-title mb-0"><?= __('There are not groups yet') ?></h5>
						<?php endif; ?>
						<div class="mt-4">
							<?php Theme::pagination(); ?>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
