<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?php
						if($is_translation) {
							$crumb_edit_name = __('Edit');
							$crumb_edit_url = '/admin/page/edit/' . $page_origin->id;

							$crumb_add_name = '<img width="18" height="18" class="d-inline-block mw-100 rounded-circle" src="' . Asset::url() . '/' . lang($page_edit->language, 'icon') . '" alt="' . $page_edit->language . '"> ' . __('translation of') . ' ' . $page_origin->title;

							Breadcrumb::edit(1, $crumb_edit_name, $crumb_edit_url);
							Breadcrumb::add($crumb_add_name);
						}

						echo Breadcrumb::render();
					?>
				</div>

				<?php
					$form_name = 'Page';

					if($is_translation) {
						$form_name = 'PageTranslation';
					}
				?>
				<form action="<?= Form::edit($form_name, $page_edit->id); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/page">
					<div class="row">
						<div class="col-12 col-md-8">
							<div class="tab">
								<ul class="nav nav-tabs" role="tablist">
									<li class="nav-item"><a class="nav-link active" href="#page-content" data-bs-toggle="tab" role="tab">Content</a></li>
									<li class="nav-item"><a class="nav-link" href="#page-seo" data-bs-toggle="tab" role="tab">SEO</a></li>
									<?php if(!empty($page_edit->custom_fieldsets)): ?>
										<li class="nav-item"><a class="nav-link" href="#page-custom-fields" data-bs-toggle="tab" role="tab">Custom fields</a></li>
									<?php endif; ?>
								</ul>
								<div class="tab-content">
									<div id="page-content" class="tab-pane active" role="tabpanel">
										<div class="form-group mb-3">
											<label class="form-label">Title</label>
											<input type="text" name="title" placeholder="Title" value="<?= $page_edit->title ?>" class="form-control" required minlength="1" maxlength="300">
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Excerpt</label>
											<textarea name="excerpt" placeholder="Excerpt" rows="1" class="form-control"><?= $page_edit->excerpt ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Content</label>
											<textarea name="content" class="form-control wysiwyg" placeholder="Compose an epic..."><?= $page_edit->content ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Tags</label>
											<select name="tags[]" multiple data-placeholder="Tags" data-addable="tag">
												<option data-placeholder="true"></option>
												<?php foreach($tags as $tag): ?>
													<?php
														$selected_tag = '';

														if(in_array($tag->id, $page_edit->tags)) {
															$selected_tag = 'selected';
														}
													?>
													<option value="<?= $tag->id ?>" <?= $selected_tag ?>><?= $tag->name ?></option>
												<?php endforeach; ?>
											</select>
										</div>
									</div>
									<div id="page-seo" class="tab-pane" role="tabpanel">
										<?php if(!$is_translation): ?>
											<div class="form-check form-switch mb-3">
												<input class="form-check-input" type="checkbox" id="no_index_no_follow" name="no_index_no_follow" <?php if($page_edit->no_index_no_follow): ?>checked<?php endif; ?>>
												<label class="form-check-label" for="no_index_no_follow">Set noindex and nofollow</label>
											</div>
										<?php endif; ?>
										<div class="form-group mb-3">
											<label class="form-label">SEO Description</label>
											<textarea name="seo_description" rows="1" class="form-control"><?= $page_edit->seo_description ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">SEO Keywords</label>
											<textarea name="seo_keywords" rows="1" class="form-control"><?= $page_edit->seo_keywords ?></textarea>
										</div>
										<div class="form-group">
											<label class="form-label">SEO Image</label>
											<input type="file" accept="image/*" name="seo_image" data-value='<?= Form::populateFiles($page_edit->seo_image) ?>'>
										</div>
									</div>
									<?php if(!empty($page_edit->custom_fieldsets)): ?>
										<div id="page-custom-fields" class="tab-pane" role="tabpanel">
											<?php
												foreach($page_edit->custom_fieldsets as $fieldset) {
													include_once $fieldset;
												}
											?>
											<textarea class="hidden" name="custom_fields"><?= hc(json_encode($page_edit->custom_fields)) ?></textarea>
										</div>
									<?php endif; ?>
								</div>
							</div>
						</div>
						<div class="col-12 col-md-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">Featured image</h5>
								</div>
								<div class="card-body filepond--no-grid">
									<input type="file" accept="image/*" name="image" data-value='<?= Form::populateFiles($page_edit->image) ?>'>
								</div>
							</div>
							<?php if(!$is_translation): ?>
								<div class="card">
									<div class="card-header">
										<h5 class="card-title mb-0">Settings</h5>
									</div>
									<div class="card-body">
										<div class="form-group mb-3">
											<label class="form-label">Author</label>
											<select name="author">
												<?php foreach($authors as $author): ?>
													<?php
														$selected_author = '';

														if($author->id === $page_edit->author) {
															$selected_author = 'selected';
														}
													?>
													<option value="<?= $author->id ?>" <?= $selected_author ?>><?= $author->name ?> (@<?= $author->login ?>)</option>
												<?php endforeach; ?>
											</select>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Category</label>
											<select name="category[]" multiple data-placeholder="Category">
												<option data-placeholder="true"></option>
												<?php foreach($categories as $category): ?>
													<?php
														$selected_category = '';

														if(in_array($category->id, $page_edit->categories)) {
															$selected_category = 'selected';
														}
													?>
													<option value="<?= $category->id ?>" <?= $selected_category ?>><?= $category->title ?></option>
												<?php endforeach; ?>
											</select>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">URL Slug</label>
											<input type="text" name="url" value="<?= $page_edit->url ?>" placeholder="sample-page" class="form-control" required minlength="1" maxlength="200" data-behavior="slug">
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Template</label>
											<select name="template" data-placeholder="Template">
												<option data-placeholder="true"></option>
												<?php foreach(Theme::pageTemplates() as $template): ?>
													<?php
														$selected_template = '';

														if($template === $page_edit->template) {
															$selected_template = 'selected';
														}
													?>
													<option value="<?= $template ?>" <?= $selected_template ?>><?= ucfirst($template) ?></option>
												<?php endforeach; ?>
											</select>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Publish date</label>
											<input type="datetime-local" name="date_publish" value="<?= format_date_input($page_edit->date_publish) ?>" class="form-control">
											<small class="form-text text-muted">Schedule publishing by setting future date</small>
										</div>
										<div class="form-check form-switch mb-3">
											<input class="form-check-input" type="checkbox" id="is_category" name="is_category" <?php if($page_edit->is_category): ?>checked<?php endif; ?>>
											<label class="form-check-label" for="is_category">Is category</label>
										</div>
										<div class="form-check form-switch mb-3">
											<input class="form-check-input" type="checkbox" id="allow_comment" name="allow_comment" <?php if($page_edit->allow_comment): ?>checked<?php endif; ?>>
											<label class="form-check-label" for="allow_comment">Allow comment</label>
										</div>
										<div class="form-check form-switch mb-3">
											<input class="form-check-input" type="checkbox" id="hide_comments" name="hide_comments" <?php if($page_edit->hide_comments): ?>checked<?php endif; ?>>
											<label class="form-check-label" for="hide_comments">Hide comments</label>
										</div>
										<div class="form-check form-switch">
											<input class="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" <?php if($page_edit->is_enabled): ?>checked<?php endif; ?>>
											<label class="form-check-label" for="is_enabled">Visibility</label>
										</div>
									</div>
								</div>
							<?php endif; ?>
							<input type="hidden" name="language" value="<?= $page_edit->language ?>">
							<button type="submit" class="btn btn-primary w-100 p-3">Edit page</button>
						</div>
					</div>
				</form>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
