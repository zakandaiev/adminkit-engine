<?php
	$page->title = __('Edit comment');
	Breadcrumb::add(__('Comments'), '/admin/comment');
	Breadcrumb::add(__('Edit'));
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

				<form action="<?= Form::edit('Comment/Edit', $comment->id); ?>" method="POST" data-redirect="<?= site('url_language') ?>/admin/comment">
					<div class="row">
						<div class="col-12 col-md-8">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">
									<?= __('In response to') ?>
										<a href="<?= site('url_language') ?>/<?= $comment->page_url ?>" target="_blank"><?= $comment->page_title ?></a>
									</h5>
									<?php if($comment->date_edited): ?>
										<small title="<?= format_date($comment->date_edited) ?>"><?= __('Last edited') ?> <?= lcfirst(date_when($comment->date_edited)) ?></small>
									<?php endif; ?>
								</div>
								<div class="card-body">
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Author') ?></label>
										<select name="author" required>
											<?php foreach($authors as $author): ?>
												<?php
													$selected_author = '';

													if($author->id === $comment->author) {
														$selected_author = 'selected';
													}
												?>
												<option value="<?= $author->id ?>" <?= $selected_author ?>><?= $author->name ?> (@<?= $author->login ?>)</option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Message') ?></label>
										<textarea name="message" placeholder="<?= __('Message') ?>" class="form-control" required minlength="1" maxlength="1000"><?= $comment->message ?></textarea>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-md-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0"><?= __('Settings') ?></h5>
								</div>
								<div class="card-body">
									<div class="form-group mb-3">
										<label class="form-label"><?= __('Publish date') ?></label>
										<input type="datetime-local" name="date_created" value="<?= format_date_input($comment->date_created) ?>" class="form-control">
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="is_approved" name="is_approved" <?php if($comment->is_approved): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="is_approved"><?= __('Approved') ?></label>
									</div>
								</div>
							</div>
							<button type="submit" class="btn btn-primary w-100 p-3"><?= __('Edit comment') ?></button>
						</div>
					</div>
				</form>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
