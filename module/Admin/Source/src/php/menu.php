<?php
	$page->title = __('Edit menu');
	if($is_edit) {
		Breadcrumb::add(__('Menu'), '/admin/menu');
		Breadcrumb::add(__('Edit'));
	} else {
		Breadcrumb::add(__('Menu'));
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

				<div class="row">
					<div class="col-12 col-md-3">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0"><?= __('List') ?></h5>
							</div>
							<div class="list-group list-group-flush">
								<?php foreach($menus as $item): ?>
									<?php
										$active_class = '';

										if($is_edit && $item->id === $edit_id) {
											$active_class = 'active';
										}
									?>
									<a href="<?= site('url_language') ?>/admin/menu/<?= $item->id ?>" class="list-group-item list-group-item-action <?= $active_class ?>">
										<span class="align-middle"><?= $item->name ?></span>
										<?php if($is_edit && $edit_id === $item->id): ?>
											<span class="float-end">
												<span data-bs-toggle="modal" data-bs-target="#menu-edit">
													<i data-feather="edit" class="feather-sm"></i>
												</span>
												<span data-action="<?= Form::delete('Menu/Menu', $item->id); ?>" data-confirm="<?=  __('Delete') . ' ' . $item->name . '?' ?>" data-redirect="<?= site('url_language') ?>/admin/menu">
													<i data-feather="trash" class="feather-sm"></i>
												</span>
											</span>
										<?php endif; ?>
									</a>
								<?php endforeach; ?>
							</div>
						</div>
						<button type="button" data-bs-toggle="modal" data-bs-target="#menu-add" class="btn btn-primary w-100"><?= __('Add menu') ?></button>
					</div>
					<div class="col-12 col-md-9">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0"><?= __('Structure') ?></h5>
							</div>
							<div class="card-body spinner-action" <?php if($is_edit): ?>data-menu-action="<?= Form::edit('Menu/Items', $edit_id); ?>"<?php endif; ?>>
								<?php if($is_edit): ?>
									<?= menu_builder($menu->items) ?>
								<?php else: ?>
									<?= __('Select menu to edit') ?> <?= __('or') ?> <a href="#" data-bs-toggle="modal" data-bs-target="#menu-add"><?= __('create a new one') ?></a>
								<?php endif; ?>
							</div>
						</div>
						<?php if($is_edit): ?>
							<div class="text-end">
								<button id="menu-add-item" type="button" class="btn btn-outline-primary"><?= __('Add menu item') ?></button>
							</div>
						<?php endif; ?>
					</div>
			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<div class="modal fade" id="menu-add">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<form action="<?= Form::add('Menu/Menu'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/menu/{id}" data-message="">
				<div class="modal-header">
					<h5 class="modal-title"><?= __('Add menu') ?></h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<label class="form-label"><?= __('Menu name') ?></label>
					<input type="text" name="name" placeholder="<?= __('Name') ?>" class="form-control" minlength="1" maxlength="200" data-behavior="slug_">
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= __('Cancel') ?></button>
					<button type="submit" class="btn btn-primary"><?= __('Add') ?></button>
				</div>
			</form>
		</div>
	</div>
</div>

<?php if($is_edit): ?>
	<div class="modal fade" id="menu-edit">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<form action="<?= Form::edit('Menu/Menu', $menu->id); ?>" method="POST" data-redirect="this">
					<div class="modal-header">
						<h5 class="modal-title"><?= __('Edit menu') ?></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<label class="form-label"><?= __('Menu name') ?></label>
						<input type="text" name="name" placeholder="<?= __('Name') ?>" value="<?= $menu->name ?>" class="form-control" minlength="1" maxlength="200" data-behavior="slug_">
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= __('Cancel') ?></button>
						<button type="submit" class="btn btn-primary"><?= __('Edit') ?></button>
					</div>
				</form>
			</div>
		</div>
	</div>
<?php endif; ?>

<li id="menu-item-blank" class="list-group-item menu-list hidden">
	<div class="menu-item">
		<i class="menu-item__icon sortable__handle feather-sm text-muted" data-feather="move"></i>
		<input class="menu-item__input" name="name" placeholder="<?= __('Name') ?>">
		<i class="menu-item__icon feather-sm text-muted" data-feather="link"></i>
		<input class="menu-item__input" name="url" placeholder="<?= __('Link') ?>">
		<i class="menu-item__icon feather-sm text-muted" data-feather="trash"></i>
	</div>
	<ul class="list-group sortable" data-multi="menu" data-handle=".sortable__handle" data-callback="editMenuItems"></ul>
</li>

<?php Theme::footer(); ?>
