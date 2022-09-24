<?php
	$page->title = __('Edit translation');
	Breadcrumb::add(__('Translations'), '/admin/translation');
	Breadcrumb::add(__('Edit'));
	$crumb_add_name = '<img width="18" height="18" class="d-inline-block mw-100 rounded-circle" src="' . Asset::url() . '/' . lang($language, 'icon') . '" alt="' . $language . '"> ' . $language . '_' . lang($language, 'region') . ' - ' . lang($language, 'name');
	Breadcrumb::add($crumb_add_name);
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
						<div class="spinner-action">
							<div class="translation"><?= $content ?></div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
