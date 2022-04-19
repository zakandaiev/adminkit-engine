<?php if(count($page->comments) > 0 && !$page->hide_comments): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title"><?= count($page->comments) ?> Comments</h3>
		</div>
		<div class="post-comments">
			<?= comments($page->comments); ?>
		</div>
	</div>
<?php endif; ?>

<?php if($page->allow_comment): ?>
	<div class="section-row">
		<div class="section-title">
			<h3 class="title">Leave a reply</h3>
		</div>
		<form class="post-reply">
			<div class="row">
				<div class="col-md-12">
					<div class="form-group">
						<textarea class="input" name="message" placeholder="Message"></textarea>
					</div>
				</div>
				<div class="col-md-4">
					<div class="form-group">
						<input class="input" type="text" name="name" placeholder="Name">
					</div>
				</div>
				<div class="col-md-4">
					<div class="form-group">
						<input class="input" type="email" name="email" placeholder="Email">
					</div>
				</div>
				<div class="col-md-4">
					<div class="form-group">
						<input class="input" type="text" name="website" placeholder="Website">
					</div>
				</div>
				<div class="col-md-12">
					<button class="primary-button">Submit</button>
				</div>

			</div>
		</form>
	</div>
<?php endif; ?>