<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="row mb-3">
					<div class="col-auto">
						<?= Breadcrumb::render() ?>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="/admin/user/add" class="btn btn-primary">Add user</a>
					</div>
				</div>

				<div class="card">
					<?php if(!empty(Request::$get['back'])): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?php out(Request::$get['back']) ?>"><i class="align-middle" data-feather="arrow-left"></i> Back</a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($users)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Groups count</th>
										<th>Create date</th>
										<th>Last login</th>
										<th>Active</th>
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
												<?php if($user->last_auth): ?>
													<a href="<?= sprintf(DEFINE::SERVICE['ip_checker'], $user->last_ip) ?>" target="_blank"><?= date_when($user->last_auth, 'd.m.Y H:i') ?></a>
												<?php else: ?>
													<i class="align-middle" data-feather="minus"></i>
												<?php endif; ?>
											</td>
											<td><?= icon_boolean($user->enabled) ?></td>
											<td class="table-action">
												<a href="/admin/user/edit/<?= $user->id ?>"><i data-feather="edit"></i></a>
												<a data-delete="<?= Form::delete('user', $user->id); ?>" data-confirm="Delete?" data-counter="#pagination-counter" href="#"><i data-feather="trash"></i></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0">There are not users yet.</h5>
						<?php endif; ?>
						<div class="mt-4">
							<?php Theme::pagination($pagination); ?>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
