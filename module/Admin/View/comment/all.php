<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3"><?= __('Comments') ?></h1>

				<div class="card">
					<?php if(!empty(Request::$get['back'])): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?php out(Request::$get['back']) ?>"><i class="align-middle" data-feather="arrow-left"></i> Back</a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($comments)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>Author</th>
										<th class="w-50">Message</th>
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
											<td><?= $comment->message ?></td>
											<td><a href="<?= site('url_language') ?>/<?= $comment->page_url ?>" target="_blank"><?= $comment->page_title ?></a></td>
											<td title="<?= format_date($comment->date_created) ?>"><?= date_when($comment->date_created) ?></td>
											<?php if(site('moderate_comments')): ?>
												<td><?= icon_boolean($comment->is_approved) ?></td>
											<?php endif; ?>
											<td class="table-action">
												<a href="/admin/comment/edit/<?= $comment->id ?>"><i data-feather="edit"></i></a>
												<a data-delete="<?= Form::delete('comment', $comment->id); ?>" data-confirm="Delete?" data-counter="#pagination-counter" href="#"><i data-feather="trash"></i></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0">There are not comments yet.</h5>
						<?php endif; ?>
						<div class="mt-4">
							<?php Theme::pagination($pagination); ?>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
