<?php
	$page->title = __('Products');
	Breadcrumb::add(__('Shop'), '/admin/shop/setting');
	Breadcrumb::add(__('Products'));
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
						<a href="<?= site('url_language') ?>/admin/shop/product/add" class="btn btn-primary">Add product</a>
					</div>
				</div>

				<div class="card">
					<div class="card-body">
						List of products
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
