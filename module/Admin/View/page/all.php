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
						<a href="/admin/page/add?is_category<?php if(Request::has('back')): ?>&category=<?= hc(Request::$get['back']) ?><?php endif; ?>" class="btn btn-secondary me-2">Add category</a>
						<a href="/admin/page/add" class="btn btn-primary">Add page</a>
					</div>
				</div>

				<div class="card">
					<?php if(Request::has('back')): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?= hc(Request::$get['back']) ?>"><i class="align-middle" data-feather="arrow-left"></i> <?= __('Back') ?></a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($pages)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>Title</th>
										<th>Translations</th>
										<th>Author</th>
										<th>Publish date</th>
										<th>Published</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($pages as $page): ?>
										<tr>
											<td>
												<?php if($page->is_category): ?>
													<i class="align-middle" data-feather="folder"></i>
													<a href="<?= site('url_language') ?>/admin/page/category/<?= $page->id ?>?back=<?= urlencode(Request::$uri) ?>"><span class="align-middle"><?= $page->title ?></span></a>
												<?php else: ?>
													<i class="align-middle" data-feather="file-text"></i>
													<span class="align-middle"><?= $page->title ?></span>
												<?php endif; ?>
												<?php if($page->url === 'home') $page->url = ''; ?>
												<a href="<?= site('url_language') ?>/<?= $page->url ?>" target="_blank"><i class="align-middle feather-sm" data-feather="external-link"></i></a>
											</td>
											<td>
												<?php
													$count_translations = count(array_intersect(array_keys($page->translations), array_keys(Module::get('languages')))) + 1;
													$count_aviable_languages = count(Module::get('languages'));
												?>
												<?php foreach($page->translations as $language => $translation): ?>
													<a href="<?= site('url_language') ?>/admin/page/edit/<?= $page->id ?>/translation/edit/<?= $translation ?>" title="<?= lang($language, 'name') ?>"><img width="18" height="18" class="d-inline-block mw-100 rounded-circle" src="<?= lang($language, 'icon') ?>" alt="<?= $language ?>"></a>
												<?php endforeach; ?>
												<?php if($count_translations < $count_aviable_languages): ?>
													<div class="dropdown d-inline-block dropend">
														<a href="#" role="button" id="translate-dropdown-<?= $page->id ?>" data-bs-toggle="dropdown" aria-expanded="false" title="<?= __('Add translation') ?>">
															<i class="align-middle" data-feather="plus"></i>
														</a>
														<div class="dropdown-menu dropdown-menu-end" aria-labelledby="translate-dropdown-<?= $page->id ?>">
															<?php foreach(Module::get('languages') as $language): ?>
																<?php if($language['key'] === $page->language) continue; ?>
																<?php if(array_key_exists($language['key'], $page->translations)) continue; ?>
																<a class="dropdown-item" href="<?= site('url_language') ?>/admin/page/edit/<?= $page->id ?>/translation/add/<?= $language['key'] ?>">
																	<img src="<?= lang($language['key'], 'icon') ?>" alt="<?= $language['key'] ?>" width="20" height="14" class="align-middle me-1">
																	<span class="align-middle"><?= $language['name'] ?></span>
																</a>
															<?php endforeach; ?>
														</div>
													</div>
												<?php endif; ?>
											</td>
											<td><a href="/admin/profile/<?= $page->author ?>"><?= $page->author_name ?></a></td>
											<td title="<?= format_date($page->date_publish) ?>"><?= date_when($page->date_publish) ?></td>
											<td>
												<?php if($page->is_pending): ?>
													<span title="Will be published <?= format_date($page->date_publish) ?>"><i class="align-middle" data-feather="clock"></i></span>
												<?php else: ?>
													<?= icon_boolean($page->is_enabled) ?>
												<?php endif; ?>
											</td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/page/edit/' . $page->id;
													$delete = [
														'data-action' => Form::delete('Page', $page->id),
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
							<h5 class="card-title mb-0">There are not pages yet</h5>
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
