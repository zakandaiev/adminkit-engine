<?php
	$page->title = __('Pages');
	Breadcrumb::add(__('Pages'));
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
						<a href="<?= site('url_language') ?>/admin/page/add?is_category<?php if(Request::has('back')): ?>&category=<?= html(Request::get('back')) ?><?php endif; ?>" class="btn btn-secondary me-2"><?= __('Add category') ?></a>
						<a href="<?= site('url_language') ?>/admin/page/add" class="btn btn-primary"><?= __('Add page') ?></a>
					</div>
				</div>

				<div class="card">
					<?php if(Request::has('back')): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?= site('url_language') ?><?= html(Request::get('back')) ?>"><i class="align-middle" data-feather="arrow-left"></i> <?= __('Back') ?></a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($pages)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th><?= sort_link('otitle', __('Title')) ?></th>
										<th><?= __('Translations') ?></th>
										<th><?= sort_link('oauthor', __('Author')) ?></th>
										<th><?= sort_link('opublishdate', __('Publish date')) ?></th>
										<th><?= sort_link('opublished', __('Published')) ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($pages as $page): ?>
										<tr>
											<td>
												<?php if($page->is_category): ?>
													<i class="align-middle" data-feather="folder"></i>
													<a href="<?= site('url_language') ?>/admin/page/category/<?= $page->id ?>?back=<?= urlencode(site('uri_cut_language')) ?>"><span class="align-middle"><?= $page->title ?></span></a>
												<?php else: ?>
													<i class="align-middle" data-feather="file-text"></i>
													<span class="align-middle"><?= $page->title ?></span>
												<?php endif; ?>
												<?php if($page->url === 'home') $page->url = ''; ?>
												<a href="<?= site('url_language') ?>/<?= $page->url ?>" target="_blank"><i class="align-middle feather-sm" data-feather="external-link"></i></a>
											</td>
											<td>
												<?php
													$count_translations = count(array_intersect($page->translations, array_keys(site('languages')))) + 1;

													$count_aviable_languages = count(site('languages'));
												?>
												<?php foreach($page->translations as $language): ?>
													<a href="<?= site('url_language') ?>/admin/page/edit/<?= $page->id ?>/translation/edit/<?= $language ?>" title="<?= lang($language, 'name') ?>"><img width="18" height="18" class="d-inline-block mw-100 rounded-circle" src="<?= Asset::url() ?>/<?= lang($language, 'icon') ?>" alt="<?= $language ?>"></a>
												<?php endforeach; ?>
												<?php if($count_translations < $count_aviable_languages): ?>
													<div class="dropdown d-inline-block dropend">
														<a href="#" role="button" id="translate-dropdown-<?= $page->id ?>" data-bs-toggle="dropdown" aria-expanded="false" title="<?= __('Add translation') ?>">
															<i class="align-middle" data-feather="plus"></i>
														</a>
														<div class="dropdown-menu dropdown-menu-end" aria-labelledby="translate-dropdown-<?= $page->id ?>">
															<?php foreach(site('languages') as $language): ?>
																<?php if($language['key'] === $page->language) continue; ?>
																<?php if(in_array($language['key'], $page->translations)) continue; ?>
																<a class="dropdown-item" href="<?= site('url_language') ?>/admin/page/edit/<?= $page->id ?>/translation/add/<?= $language['key'] ?>">
																	<img src="<?= Asset::url() ?>/<?= lang($language['key'], 'icon') ?>" alt="<?= $language['key'] ?>" width="20" height="14" class="align-middle me-1">
																	<span class="align-middle"><?= $language['name'] ?></span>
																</a>
															<?php endforeach; ?>
														</div>
													</div>
												<?php endif; ?>
											</td>
											<td><?= filter_link('author', $page->author, $page->author_name) ?></td>
											<td title="<?= format_date($page->date_publish) ?>"><?= date_when($page->date_publish) ?></td>
											<td>
												<?php if($page->is_pending): ?>
													<span title="Will be published <?= format_date($page->date_publish) ?>"><i class="align-middle" data-feather="clock"></i></span>
												<?php else: ?>
													<?php
														$published_title = $page->is_enabled ? __('Unpublish this page') : __('Publish this page');
													?>
													<a href="#" data-action="<?= Form::edit('Page/TogglePublish', $page->id) ?>" data-fields='[{"key":"is_enabled","value":<?= $page->is_enabled ?>}]' data-redirect="this" title="<?= $published_title ?>" data-bs-toggle="tooltip">
														<?= icon_boolean($page->is_enabled) ?>
													</a>
												<?php endif; ?>
											</td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/page/edit/' . $page->id;
													$delete = [
														'data-action' => Form::delete('Page/Page', $page->id),
														'data-confirm' => __('Delete') . ' ' . $page->title . '?',
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
							<h5 class="card-title mb-0"><?= __('There are not pages yet') ?></h5>
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
