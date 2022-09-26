<?php
	$page->title = (Request::has('is_category')) ? __('Add category') : __('Add page');
	Breadcrumb::add(__('Pages'), '/admin/page');
	Breadcrumb::add((Request::has('is_category')) ? __('Add category') : __('Add page'));
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

				<form action="<?= Form::add('Page/Page'); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/page" data-focus>
					<div class="row">
						<div class="col-12 col-md-8">
							<div class="tab">
								<ul class="nav nav-tabs" role="tablist">
									<li class="nav-item"><a class="nav-link active" href="#page-content" data-bs-toggle="tab" role="tab"><?= __('Content') ?></a></li>
									<li class="nav-item"><a class="nav-link" href="#page-seo" data-bs-toggle="tab" role="tab">SEO</a></li>
								</ul>
								<div class="tab-content">
									<div id="page-content" class="tab-pane active" role="tabpanel">
										<div class="form-group mb-3">
											<label class="form-label"><?= __('Title') ?></label>
											<input type="text" name="title" placeholder="<?= __('Title') ?>" class="form-control" required minlength="1" maxlength="300" data-behavior="slug" data-target="url">
										</div>
										<div class="form-group mb-3">
											<label class="form-label"><?= __('Excerpt') ?></label>
											<textarea name="excerpt" placeholder="<?= __('Excerpt') ?>" rows="1" class="form-control"></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label"><?= __('Content') ?></label>
											<textarea name="content" class="form-control wysiwyg" placeholder="<?= __('Compose an epic...') ?>"></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label"><?= __('Tags') ?></label>
											<select name="tags[]" multiple data-placeholder="<?= __('Tags') ?>" data-addable="tag">
												<option data-placeholder></option>
												<?php foreach($tags as $tag): ?>
													<option value="<?= $tag->id ?>"><?= $tag->name ?></option>
												<?php endforeach; ?>
											</select>
										</div>
									</div>
									<div id="page-seo" class="tab-pane" role="tabpanel">
										<div class="form-check form-switch mb-3">
											<input class="form-check-input" type="checkbox" id="no_index_no_follow" name="no_index_no_follow">
											<label class="form-check-label" for="no_index_no_follow"><?= __('Set') ?> noindex <?= __('and') ?> nofollow</label>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">SEO <?= __('Description') ?></label>
											<textarea name="seo_description" rows="1" class="form-control"></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">SEO <?= __('Keywords') ?></label>
											<textarea name="seo_keywords" rows="1" class="form-control"></textarea>
										</div>
										<div class="form-group">
											<label class="form-label">SEO <?= __('Image') ?></label>
											<input type="file" accept="image/*" name="seo_image">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-md-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0"><?= __('Featured image') ?></h5>
								</div>
								<div class="card-body filepond--no-grid">
									<input type="file" accept="image/*" name="image">
								</div>
							</div>
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0"><?= __('Settings') ?></h5>
								</div>
								<div class="card-body">
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Author') ?></label>
										<select name="author" data-placeholder="<?= __('Author') ?>">
											<?php foreach($authors as $author): ?>
												<?php
													$selected_author = '';

													if($author->id === User::get()->id) {
														$selected_author = 'selected';
													}
												?>
												<option value="<?= $author->id ?>" <?= $selected_author ?>><?= $author->name ?> (@<?= $author->login ?>)</option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Category') ?></label>
										<select name="category[]" multiple data-placeholder="<?= __('Category') ?>">
											<option data-placeholder></option>
											<?php foreach($categories as $category): ?>
												<option value="<?= $category->id ?>"><?= $category->title ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label"><?= __('URL slug') ?></label>
										<input type="text" name="url" value="sample-page" placeholder="sample-page" class="form-control" required minlength="1" maxlength="300" data-behavior="slug">
									</div>
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Template') ?></label>
										<select name="template" data-placeholder="<?= __('Template') ?>">
											<option data-placeholder></option>
											<?php foreach(Theme::pageTemplates() as $template): ?>
												<option value="<?= $template ?>"><?= ucfirst($template) ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Publish date') ?></label>
										<input type="datetime-local" name="date_publish" value="<?= format_date_input() ?>" class="form-control">
										<small class="form-text text-muted"><?= __('Schedule publishing by setting future date') ?></small>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="is_category" name="is_category" <?php if(Request::has('is_category')): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="is_category"><?= __('Category') ?></label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="allow_comment" name="allow_comment" checked>
										<label class="form-check-label" for="allow_comment"><?= __('Allow commenting') ?></label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="hide_comments" name="hide_comments">
										<label class="form-check-label" for="hide_comments"><?= __('Hide comments') ?></label>
									</div>
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked>
										<label class="form-check-label" for="is_enabled"><?= __('Published') ?></label>
									</div>
								</div>
							</div>
							<input type="hidden" name="language" value="<?= site('language') ?>">
							<button type="submit" class="btn btn-primary w-100 p-3"><?= __('Add page') ?></button>
						</div>
					</div>
				</form>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
