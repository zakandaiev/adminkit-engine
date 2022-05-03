<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="row mb-3">
					<div class="col-auto">
						<h1 class="h3 d-inline align-middle">Groups</h1>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="/admin/group/add" class="btn btn-primary">Add group</a>
					</div>
				</div>

				<div class="card">
					<?php if(!empty(Request::$get['back'])): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?php out(Request::$get['back']) ?>"><i class="align-middle" data-feather="arrow-left"></i> Back</a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($groups)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Routes count</th>
										<th>Users count</th>
										<th>Create date</th>
										<th>Active</th>
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
													Access all
												<?php else: ?>
													<?= $group->count_routes ?>
												<?php endif; ?>
											</td>
											<td><a href="/admin/user"><?= $group->count_users ?></a></td>
											<td title="<?= format_date($group->date_created) ?>"><?= date_when($group->date_created) ?></td>
											<td>
												<?php if($group->enabled): ?>
													<i class="align-middle" data-feather="check"></i>
												<?php else: ?>
													<i class="align-middle" data-feather="x"></i>
												<?php endif; ?>
											</td>
											<td class="table-action">
												<a href="/admin/group/edit/<?= $group->id ?>"><i data-feather="edit"></i></a>
												<a data-delete="<?= Form::delete('group', $group->id); ?>" data-confirm="Delete?" data-counter="#pagination-counter" href="#"><i data-feather="trash"></i></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0">There are not groups yet.</h5>
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
