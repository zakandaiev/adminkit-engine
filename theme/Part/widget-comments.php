<?php if(count($page->comments) > 0 && !$page->hide_comments): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title">
				<?= $page->comments_count ?>
				<?= translator_noun_form($page->comments_count, 'comments') ?>
				 <?= $comments_title ?>
			</h3>
		</div>
		<div class="post-comments">
			<?= comments($page->comments); ?>
		</div>
	</div>
<?php endif; ?>

<?php if($page->allow_comment && User::get()->authorized): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title"><?= __('Leave a reply') ?></h3>
		</div>
		<form action="<?= Form::add('Comment') ?>" method="POST" data-redirect="this" class="post-reply">
			<div class="form-group">
				<textarea class="input" name="message" minlength="2" maxlength="500" placeholder="<?= __('Message') ?>" required></textarea>
			</div>
			<input type="hidden" name="parent">
			<input type="hidden" name="page_id" value="<?= $page->id ?>">
			<input type="hidden" name="<?= COOKIE_KEY['csrf'] ?>" value="<?= Request::$csrf ?>">
			<button type="submit" class="primary-button"><?= __('Submit') ?></button>
		</form>
	</div>
<?php endif; ?>
