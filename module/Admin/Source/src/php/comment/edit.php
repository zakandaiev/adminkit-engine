<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3">
					<?= __('Comments') ?>
					<i data-feather="arrow-right"></i>
					<?= __('Edit') ?>
				</h1>

				<form action="<?= Form::edit('Comment', $comment->id); ?>" method="POST" data-redirect="<?= site('url_lang') ?>/admin/comment">
					<div class="row">
						<div class="col-12 col-md-8">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">
										In response to
										<a href="<?= site('url_language') ?>/<?= $comment->page_url ?>" target="_blank"><?= $comment->page_title ?></a>
									</h5>
									<?php if($comment->date_edited): ?>
										<small title="<?= format_date($comment->date_edited) ?>">Last edited <?= lcfirst(date_when($comment->date_edited)) ?></small>
									<?php endif; ?>
								</div>
								<div class="card-body">
									<div class="form-group mb-3">
										<label class="form-label">Author</label>
										<select name="author">
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
										<label class="form-label">Message</label>
										<textarea name="message" placeholder="Message" class="form-control"><?= $comment->message ?></textarea>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-md-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title mb-0">Settings</h5>
								</div>
								<div class="card-body">
									<div class="form-group mb-3">
										<label class="form-label">Publish date</label>
										<input type="datetime-local" name="date_created" value="<?= format_date_input($comment->date_created) ?>" class="form-control">
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="is_approved" name="is_approved" <?php if($comment->is_approved): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="is_approved">Is approved</label>
									</div>
								</div>
							</div>
							<button type="submit" class="btn btn-primary w-100 p-3">Edit comment</button>
						</div>
					</div>
				</form>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>