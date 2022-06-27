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
						<a href="<?= site('url_language') ?>/admin/user/add" class="btn btn-primary"><?= __('Add user') ?></a>
					</div>
				</div>

				<div class="card">
					<div class="card-body">
						<?php if(!empty($users)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>ID</th>
										<th><?= __('Name') ?></th>
										<th><?= __('Groups count') ?></th>
										<th><?= __('Create date') ?></th>
										<th><?= __('Last login') ?></th>
										<th><?= __('Active') ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($users as $user): ?>
										<tr>
											<td><?= $user->id ?></td>
											<td><?= $user->name ?> (@<?= $user->login ?>)</td>
											<td><a href="/admin/group"><?= $user->count_groups ?></a></td>
											<td title="<?= format_date($user->date_created) ?>"><?= date_when($user->date_created) ?></td>
											<td>
												<?php if($user->auth_date): ?>
													<a href="<?= sprintf(SERVICE['ip_checker'], $user->auth_ip) ?>" target="_blank"><?= date_when($user->auth_date, 'd.m.Y H:i') ?></a>
												<?php else: ?>
													<i class="align-middle" data-feather="minus"></i>
												<?php endif; ?>
											</td>
											<td><?= icon_boolean($user->is_enabled) ?></td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/user/edit/' . $user->id;
													$delete = [
														'data-action' => Form::delete('User', $user->id),
														'data-confirm' => __('Delete') . ' ' . $user->name . '(@' . $user->login . ')' . '?',
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
							<h5 class="card-title mb-0"><?= __('There are not users yet') ?></h5>
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
