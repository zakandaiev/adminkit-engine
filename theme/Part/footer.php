<footer id="footer">
	<div class="container">
		<div class="row">
			<div class="col-md-3">
				<div class="footer-widget">
					<div class="footer-logo">
						<a href="<?= site('url_language') ?>" class="logo"><img src="<?= site('url') ?>/<?= site('logo_alt') ?>" alt=""></a>
					</div>
					<p><?= site('description') ?></p>
					<?php Theme::menu('socials', ['class' => 'contact-social']); ?>
				</div>
			</div>
			<?php
				$fw_categories = $page_model->getCategories();
			?>
			<?php if(!empty($fw_categories)): ?>
				<div class="col-md-3">
					<div class="footer-widget">
						<h3 class="footer-title"><?= __('Categories') ?></h3>
						<div class="category-widget">
							<ul>
								<?php foreach($fw_categories as $category): ?>
									<li><a href="<?= site('url_language') ?>/<?= $category->url ?>"><?= $category->title ?> <span><?= $category->count_pages ?></span></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<?php
				$fw_tags = $page_model->getTags();
			?>
			<?php if(!empty($fw_tags)): ?>
				<div class="col-md-3">
					<div class="footer-widget">
						<h3 class="footer-title"><?= __('Tags') ?></h3>
						<div class="tags-widget">
							<ul>
								<?php foreach($fw_tags as $tag): ?>
									<li><a href="<?= site('url_language') ?>/tag/<?= $tag->url ?>"><?= $tag->name ?></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<div class="col-md-3">
				<div class="footer-widget">
					<h3 class="footer-title"><?= __('Newsletter') ?></h3>
					<div class="newsletter-widget">
						<form>
							<p><?= __('Nec feugiat nisl pretium fusce id velit ut tortor pretium.') ?></p>
							<input class="input" name="newsletter" placeholder="<?= __('Enter Your Email') ?>">
							<button class="primary-button"><?= __('Subscribe') ?></button>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-bottom row">
			<div class="col-md-6 col-md-push-6">
				<?php Theme::menu('footer'); ?>
			</div>
			<div class="col-md-6 col-md-pull-6">
				<div class="footer-copyright">
					<?= date('Y') ?> &copy; Made by <a href="https://colorlib.com" target="_blank">Colorlib</a>
				</div>
			</div>
		</div>
	</div>
</footer>

</body>

</html>
