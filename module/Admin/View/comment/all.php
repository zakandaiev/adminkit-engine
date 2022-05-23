<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="mb-3">
					<?= Breadcrumb::render() ?>
				</div>

				<div class="card">
					<div class="card-body">
						<?php if(!empty($comments)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>Author</th>
										<th>Message</th>
										<th>Page</th>
										<th>Created</th>
										<?php if(site('moderate_comments')): ?>
											<th>Is approved</th>
										<?php endif; ?>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($comments as $comment): ?>
										<tr>
											<td><a href="/admin/profile/<?= $comment->author ?>"><?= $comment->author_name ?></a></td>
											<td>
												<?php if(strlen($comment->message) > 50): ?>
													<span data-bs-toggle="tooltip" data-bs-placement="top" title="<?= $comment->message ?>"><?= substr($comment->message, 0, 50) ?>...</span>
												<?php else: ?>
													<?= $comment->message ?>
												<?php endif; ?>
											</td>
											<td><a href="<?= site('url_language') ?>/<?= $comment->page_url ?>" target="_blank"><?= $comment->page_title ?></a></td>
											<td title="<?= format_date($comment->date_created) ?>"><?= date_when($comment->date_created) ?></td>
											<?php if(site('moderate_comments')): ?>
												<td><?= icon_boolean($comment->is_approved) ?></td>
											<?php endif; ?>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/comment/edit/' . $comment->id;
													$delete = [
														'data-action' => Form::delete('Comment', $comment->id),
														'data-confirm' => __('Delete comment by') . ' ' . $comment->author_name . '?',
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
							<h5 class="card-title mb-0">There are not comments yet</h5>
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
