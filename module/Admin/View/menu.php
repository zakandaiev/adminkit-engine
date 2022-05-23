<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

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
								<h5 class="card-title mb-0"><?= __('Menu list') ?></h5>
							</div>
							<div class="list-group list-group-flush">
								<?php foreach($menus as $item): ?>
									<?php
										$active_class = '';

										if($is_edit && $item->id === $edit_id) {
											$active_class = 'active';
										}
									?>
									<a href="<?= site('url_language') ?>/admin/menu/<?= $item->id ?>" class="list-group-item list-group-item-action <?= $active_class ?>"><?= $item->name ?></a>
								<?php endforeach; ?>
							</div>
						</div>
						<button type="submit" class="btn btn-primary w-100"><?= __('Add menu') ?></button>
					</div>
					<div class="col-12 col-md-9">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title mb-0"><?= __('Menu structure') ?></h5>
							</div>
							<div class="card-body spinner-action">
								<?php if($is_edit): ?>
									<?= menu_builder($menu) ?>
								<?php else: ?>
									<?= __('Select menu item to edit') ?> <?= __('or') ?> <a href="#" data-action="#"><?= __('create a new one') ?></a>
								<?php endif; ?>
							</div>
						</div>
						<?php if($is_edit): ?>
							<div class="text-end">
								<button type="submit" class="btn btn-outline-primary"><?= __('Add menu item') ?></button>
							</div>
						<?php endif; ?>
					</div>
			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
