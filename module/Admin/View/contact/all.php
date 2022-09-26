<?php
	$page->title = __('Messages');
	Breadcrumb::add(__('Messages'));
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
						<?php if(!empty($contacts)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th class="w-25"><?= sort_link('oauthor', __('Author')) ?></th>
										<th class="w-50"><?= __('Message') ?></th>
										<th><?= sort_link('ocreated', __('Created')) ?></th>
										<th><?= sort_link('oread', __('Read')) ?></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($contacts as $contact): ?>
										<tr>
											<td>
												<?php if($contact->user_id): ?>
													<b><?= __('User') ?>:</b>
													<a href="<?= site('url_language') ?>/admin/profile/<?= $contact->user_id ?>"><?= User::get($contact->user_id)->nicename ?></a>
													<br>
												<?php endif; ?>

												<b><?= __('Email') ?>:</b>
												<a href="mailto:<?= $contact->email ?>" target="_blank"><?= $contact->email ?></a>
												<br>

												<b>IP:</b>
												<a href="<?= sprintf(SERVICE['ip_checker'], $contact->ip) ?>" target="_blank"><?= $contact->ip ?></a>
											</td>
											<td>
												<?php if($contact->subject): ?>
													<b><?= __('Subject') ?>:</b>
													<?= $contact->subject ?>
													<br>
													<b><?= __('Message') ?>:</b>
												<?php endif; ?>

												<?php if(strlen($contact->message) > 50): ?>
													<span data-bs-toggle="tooltip" title="<?= html($contact->message) ?>"><?= html(excerpt($contact->message, 50)) ?></span>
												<?php else: ?>
													<?= html($contact->message) ?>
												<?php endif; ?>
											</td>
											<td title="<?= format_date($contact->date_created) ?>"><?= date_when($contact->date_created) ?></td>
											<td>
												<?php
													$read_title = $contact->is_read ? __('Unread this message') : __('Read this message');
												?>
												<a href="#" data-action="<?= Form::edit('Contact/ToggleRead', $contact->id) ?>" data-fields='[{"key":"is_read","value":<?= $contact->is_read ?>}]' data-redirect="this" title="<?= $read_title ?>" data-bs-toggle="tooltip">
													<?= icon_boolean($contact->is_read) ?>
												</a>
											</td>
											<td class="table-action">
												<a data-action="<?= Form::delete('Contact/Edit', $contact->id) ?>" data-confirm="<?= __('Delete this message') ?>?" data-delete="trow" data-counter="#pagination-counter" href="#"><i data-feather="trash"></i></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0"><?= __('There are not messages yet') ?></h5>
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
