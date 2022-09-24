<?php
	$page->title = __('Comments');
	Breadcrumb::add(__('Comments'));
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
						<?php if(!empty($comments)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th><?= sort_link('oauthor', __('Author')) ?></th>
										<th><?= __('Message') ?></th>
										<th><?= sort_link('opage', __('Page')) ?></th>
										<th><?= sort_link('ocreated', __('Created')) ?></th>
										<th><?= sort_link('oapproved', __('Approved')) ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($comments as $comment): ?>
										<tr>
											<td><?= filter_link('author', $comment->author, $comment->author_name) ?></td>
											<td>
												<?php if(strlen($comment->message) > 50): ?>
													<span data-bs-toggle="tooltip" title="<?= html($comment->message) ?>"><?= html(excerpt($comment->message, 50)) ?></span>
												<?php else: ?>
													<?= html($comment->message) ?>
												<?php endif; ?>
											</td>
											<td><a href="<?= site('url_language') ?>/<?= $comment->page_url ?>" target="_blank"><?= $comment->page_title ?></a></td>
											<td title="<?= format_date($comment->date_created) ?>"><?= date_when($comment->date_created) ?></td>
											<td>
												<?php
													$approve_title = $comment->is_approved ? __('Disapprove this comment') : __('Approve this comment');
												?>
												<a href="#" data-action="<?= Form::edit('Comment/ToggleApprove', $comment->id) ?>" data-fields='[{"key":"is_approved","value":<?= $comment->is_approved ?>}]' data-redirect="this" title="<?= $approve_title ?>" data-bs-toggle="tooltip">
													<?= icon_boolean($comment->is_approved) ?>
												</a>
											</td>
											<td class="table-action">
												<?php
													$edit_url = site('url_language') . '/admin/comment/edit/' . $comment->id;
													$delete = [
														'data-action' => Form::delete('Comment/Edit', $comment->id),
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
							<h5 class="card-title mb-0"><?= __('There are not comments yet') ?></h5>
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
