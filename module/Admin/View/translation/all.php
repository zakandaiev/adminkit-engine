<?php
	$page->title = __('Translations');
	Breadcrumb::add(__('Translations'));
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
						<?php if(!empty($languages)): ?>
							<table class="table table-sm m-0">
								<tbody>
									<?php foreach($languages as $module => $module_languages): ?>
										<tr>
											<td>
												<div class="log">
													<i class="align-middle" data-feather="folder"></i>
													<a data-bs-toggle="collapse" href="#module-<?= $module ?>" role="button" aria-expanded="false" aria-controls="module-<?= $module ?>" class="collapsed">
														<span class="align-middle"><?= $module ?></span>
													</a>
													<div id="module-<?= $module ?>" class="log collapse">
														<i class="align-middle" data-feather="plus"></i>
														<a href="<?= site('url_language') ?>/admin/translation/<?= $module ?>/add" class="align-middle">
															<?= __('Create new translation') ?>
														</a>
													</div>
													<?php foreach($module_languages as $language): ?>
														<div id="module-<?= $module ?>" class="log collapse">
																<i class="align-middle" data-feather="file-text"></i>
																<a href="<?= site('url_language') ?>/admin/translation/<?= $module ?>/<?= $language['key'] ?>" class="align-middle">
																	<?= $language['key'] ?>_<?= $language['region'] ?> - <?= $language['name'] ?>
																</a>
														</div>
													<?php endforeach; ?>
												</div>
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
