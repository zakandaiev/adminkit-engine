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
						<?php if(!empty($languages)): ?>
							<table class="table table-sm m-0">
								<tbody>
									<?php foreach($languages as $language): ?>
										<tr>
											<td>
												<i data-feather="file-text" class="align-middle"></i>
												<a href="<?= site('url_language') ?>/admin/translation/<?= $language['key'] ?>" class="align-middle"><?= $language['key'] ?>_<?= $language['region'] ?> - <?= $language['name'] ?></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0"><?= __('There are not translations yet') ?></h5>
						<?php endif; ?>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
