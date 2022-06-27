<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::sidebar(); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
				<?php
						$crumb_add_name = '<img width="18" height="18" class="d-inline-block mw-100 rounded-circle" src="' . Asset::url() . '/' . lang($language['key'], 'icon') . '" alt="' . $language['key'] . '"> ' . $language['key'] . '_' . $language['region'] . ' - ' . $language['name'];

						Breadcrumb::add($crumb_add_name);

						echo Breadcrumb::render();
					?>
				</div>

				<div class="card">
					<div class="card-header">
						<h5 class="card-title mb-0">
							<?php
								$translation_url = site('url') . '/language/' . $language['file_name'];
								echo '<a href="' . $translation_url . '" target="_blank">' . $translation_url . '</a>';
							?>
						</h5>
					</div>
					<div class="card-body">
						<div class="spinner-action">
							<div class="translation"><?= $body ?></div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
