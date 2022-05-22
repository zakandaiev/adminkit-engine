<footer id="footer">
	<div class="container">
		<div class="row">
			<div class="col-md-3">
				<div class="footer-widget">
					<div class="footer-logo">
						<a href="/" class="logo"><img src="/<?= site('logo_alt') ?>" alt=""></a>
					</div>
					<p><?= site('description') ?></p>
					<?php Theme::menu('socials', ['class' => 'contact-social']); ?>
				</div>
			</div>
			<?php
				$fw_categories = $model->getCategories();
			?>
			<?php if(!empty($fw_categories)): ?>
				<div class="col-md-3">
					<div class="footer-widget">
						<h3 class="footer-title">Categories</h3>
						<div class="category-widget">
							<ul>
								<?php foreach($fw_categories as $category): ?>
									<li><a href="/<?= $category->url ?>"><?= $category->title ?> <span><?= $category->count_pages ?></span></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<?php
				$fw_tags = $model->getTags();
			?>
			<?php if(!empty($fw_tags)): ?>
				<div class="col-md-3">
					<div class="footer-widget">
						<h3 class="footer-title">Tags</h3>
						<div class="tags-widget">
							<ul>
								<?php foreach($fw_tags as $tag): ?>
									<li><a href="/tag/<?= $tag->url ?>"><?= $tag->name ?></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<div class="col-md-3">
				<div class="footer-widget">
					<h3 class="footer-title">Newsletter</h3>
					<div class="newsletter-widget">
						<form>
							<p>Nec feugiat nisl pretium fusce id velit ut tortor pretium.</p>
							<input class="input" name="newsletter" placeholder="Enter Your Email">
							<button class="primary-button">Subscribe</button>
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
					Copyright &copy; <?= date('Y') ?> All rights reserved | Made by <a href="https://colorlib.com" target="_blank">Colorlib</a>
				</div>
			</div>
		</div>
	</div>
</footer>

<?= Asset::render('js'); ?>

</body>

</html>
