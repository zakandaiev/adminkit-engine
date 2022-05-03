<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3">Edit page</h1>

				<form action="<?= Form::edit('Page', $page->id); ?>" method="POST" data-redirect="/admin/page">
					<div class="row">
						<div class="col-12 col-md-8">
							<div class="tab">
								<ul class="nav nav-tabs" role="tablist">
									<li class="nav-item"><a class="nav-link active" href="#page-content" data-bs-toggle="tab" role="tab">Content</a></li>
									<li class="nav-item"><a class="nav-link" href="#page-gallery" data-bs-toggle="tab" role="tab">Gallery</a></li>
									<li class="nav-item"><a class="nav-link" href="#page-seo" data-bs-toggle="tab" role="tab">SEO</a></li>
									<li class="nav-item"><a class="nav-link" href="#page-custom-fields" data-bs-toggle="tab" role="tab">Custom fields</a></li>
								</ul>
								<div class="tab-content">
									<div id="page-content" class="tab-pane active" role="tabpanel">
										<div class="form-group mb-3">
											<label class="form-label">Title</label>
											<input type="text" name="title" placeholder="Title" value="<?= $page->title ?>" class="form-control" required minlength="1" maxlength="300">
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Excerpt</label>
											<textarea name="excerpt" placeholder="Excerpt" rows="1" class="form-control"><?= $page->excerpt ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Content</label>
											<textarea name="content" class="form-control wysiwyg" placeholder="Compose an epic..."><?= $page->content ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">Tags</label>
											<select name="tags[]" multiple data-placeholder="Tags" data-addable="tag">
												<option data-placeholder="true"></option>
												<?php foreach($tags as $tag): ?>
													<?php
														$selected_tag = '';

														if(in_array($tag->id, $page->tags)) {
															$selected_tag = 'selected';
														}
													?>
													<option value="<?= $tag->id ?>" <?= $selected_tag ?>><?= $tag->name ?></option>
												<?php endforeach; ?>
											</select>
										</div>
									</div>
									<div id="page-gallery" class="tab-pane" role="tabpanel">
										<div class="form-group">
											<label class="form-label">Gallery</label>
											<input type="file" accept="image/*" name="gallery[]" multiple data-value='<?= Form::populateFiles($page->gallery) ?>'>
										</div>
									</div>
									<div id="page-seo" class="tab-pane" role="tabpanel">
										<div class="form-check form-switch mb-3">
											<input class="form-check-input" type="checkbox" id="no_index_no_follow" name="no_index_no_follow" <?php if($page->no_index_no_follow): ?>checked<?php endif; ?>>
											<label class="form-check-label" for="no_index_no_follow">Set noindex and nofollow</label>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">SEO Description</label>
											<textarea name="seo_description" rows="1" class="form-control"><?= $page->seo_description ?></textarea>
										</div>
										<div class="form-group mb-3">
											<label class="form-label">SEO Keywords</label>
											<textarea name="seo_keywords" rows="1" class="form-control"><?= $page->seo_keywords ?></textarea>
										</div>
										<div class="form-group">
											<label class="form-label">SEO Image</label>
											<input type="file" accept="image/*" name="seo_image" data-value='<?= Form::populateFiles($page->seo_image) ?>'>
										</div>
									</div>
									<div id="page-custom-fields" class="tab-pane" role="tabpanel">
										<div class="form-group mb-3">
											<label class="form-label">Field</label>
											<div class="modal fade foreign-form" data-name="custom_fields" data-value='<?= hc(json_encode($page->custom_fields)) ?>'>
												<div class="modal-dialog modal-dialog-centered">
													<div class="modal-content">
														<div class="modal-header">
															<h5 class="modal-title">Add custom field</h5>
															<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
														</div>
														<div class="modal-body">
															<div class="mb-3">
																<label class="form-label">Field name</label>
																<input type="text" name="name" placeholder="Name" class="form-control" minlength="1" maxlength="200">
															</div>
															<div class="mb-3">
																<label class="form-label">Field value</label>
																<input type="text" name="value" placeholder="Value" class="form-control" minlength="1" maxlength="200">
															</div>
														</div>
														<div class="modal-footer">
															<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
															<button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-md-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">Featured image</h5>
								</div>
								<div class="card-body filepond--no-grid">
									<input type="file" accept="image/*" name="image" data-value='<?= Form::populateFiles($page->image) ?>'>
								</div>
							</div>
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

													if($author->id === $page->author) {
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

													if(in_array($category->id, $page->categories)) {
														$selected_category = 'selected';
													}
												?>
												<option value="<?= $category->id ?>" <?= $selected_category ?>><?= $category->title ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label">URL Slug</label>
										<input type="text" name="url" value="<?= $page->url ?>" placeholder="sample-page" class="form-control" required minlength="1" maxlength="200" data-behavior="slug">
									</div>
									<div class="form-group mb-3">
										<label class="form-label">Template</label>
										<select name="template" data-placeholder="Template">
											<option data-placeholder="true"></option>
											<?php foreach(Theme::pageTemplates() as $template): ?>
												<?php
													$selected_template = '';

													if($template === $page->template) {
														$selected_template = 'selected';
													}
												?>
												<option value="<?= $template ?>" <?= $selected_template ?>><?= ucfirst($template) ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label">Publish date</label>
										<input type="datetime-local" name="date_publish" value="<?= format_date_input($page->date_publish) ?>" class="form-control">
										<small class="form-text text-muted">Schedule publishing by setting future date</small>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="is_category" name="is_category" <?php if($page->is_category): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="is_category">Is category</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="is_static" name="is_static" <?php if($page->is_static): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="is_static">Is static</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="allow_comment" name="allow_comment" <?php if($page->allow_comment): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="allow_comment">Allow comment</label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="hide_comments" name="hide_comments" <?php if($page->hide_comments): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="hide_comments">Hide comments</label>
									</div>
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" id="enabled" name="enabled" <?php if($page->enabled): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="enabled">Visibility</label>
									</div>
								</div>
							</div>
							<input type="hidden" name="language" value="<?= $page->language ?>">
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
