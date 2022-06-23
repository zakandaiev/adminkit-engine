<?php if(count($page->comments) > 0 && !$page->hide_comments): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title"><?= count($page->comments) ?> <?= __('Comments') ?></h3>
		</div>
		<div class="post-comments">
			<?= comments($page->comments); ?>
		</div>
	</div>
<?php endif; ?>

<?php if($page->allow_comment && Auth::$user->authorized): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title"><?= __('Leave a reply') ?></h3>
		</div>
		<form class="post-reply">
			<div class="form-group">
				<textarea class="input" name="message" placeholder="<?= __('Message') ?>"></textarea>
			</div>
			<button class="primary-button"><?= __('Submit') ?></button>
		</form>
	</div>
<?php endif; ?>
