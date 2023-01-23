<?php Theme::header(); ?>

<div id="post-header" class="page-header">
	<?php if(!empty($page->image)): ?>
		<div class="page-header-bg" style='background-image: url("<?= site('url') ?>/<?= $page->image ?>")' data-stellar-background-ratio="0.5"></div>
	<?php endif; ?>
	<div class="container">
		<div class="row">
			<div class="col-md-10">
				<?php if(!empty($page->categories)): ?>
					<div class="post-category">
						<?php foreach($page->categories as $category): ?>
							<a href="<?= site('url_language') ?>/<?= $category->url ?>"><?= $category->title ?></a>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
				<h1><?= $page->title ?></h1>
				<ul class="post-meta">
					<li><a href="<?= site('url_language') ?>/author/<?= $page->author ?>"><?= $page->author_name ?></a></li>
					<li><?= date_when($page->date_publish) ?></li>
					<li><i class="fa fa-comments"></i> <?= $page->comments_count ?></li>
					<li><i class="fa fa-eye"></i> <?= $page->views ?></li>
				</ul>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<div class="section-row">
					<div class="post-share">
						<a href="#" class="social-facebook"><i class="fa fa-facebook"></i><span><?= __('Share') ?></span></a>
						<a href="#" class="social-twitter"><i class="fa fa-twitter"></i><span><?= __('Tweet') ?></span></a>
						<a href="#" class="social-pinterest"><i class="fa fa-pinterest"></i><span><?= __('Pin') ?></span></a>
						<a href="#" ><i class="fa fa-envelope"></i><span><?= __('Email') ?></span></a>
					</div>
				</div>

				<div class="section-row"><?= $page->content ?? $page->title ?></div>

				<?php if(!empty($page->tags)): ?>
					<div class="section-row">
						<div class="post-tags">
							<ul>
								<li><?= __('TAGS') ?>:</li>
								<?php foreach($page->tags as $tag): ?>
									<li><a href="<?= site('url_language') ?>/tag/<?= $tag->url ?>"><?= $tag->name ?></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
				<?php endif; ?>

				<?php
					$prev_next = $page_model->getPagePrevNext($page->id);
				?>
				<?php if(!empty($prev_next->prev) || !empty($prev_next->next)): ?>
					<div class="section-row">
						<div class="post-nav">
							<?php if(!empty($prev_next->prev->url)): ?>
								<div class="prev-post">
									<a class="post-img" href="<?= site('url_language') ?>/<?= $prev_next->prev->url ?>"><img src="<?= site('url') ?>/<?= $prev_next->prev->image ?>" alt=""></a>
									<h3 class="post-title"><a href="<?= site('url_language') ?>/<?= $prev_next->prev->url ?>"><?= $prev_next->prev->title ?></a></h3>
									<span><?= __('Previous post') ?></span>
								</div>
							<?php endif; ?>
							<?php if(!empty($prev_next->next->url)): ?>
								<div class="next-post">
									<a class="post-img" href="<?= site('url_language') ?>/<?= $prev_next->next->url ?>"><img src="<?= site('url') ?>/<?= $prev_next->next->image ?>" alt=""></a>
									<h3 class="post-title"><a href="<?= site('url_language') ?>/<?= $prev_next->next->url ?>"><?= $prev_next->next->title ?></a></h3>
									<span><?= __('Next post') ?></span>
								</div>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>

				<?php
					$author = $page_model->getAuthor($page->author);
					$author_socials = json_decode($author->socials) ?? [];
				?>
				<?php if(!empty($page->author_name) && !empty($author->about)): ?>
					<div class="section-row">
						<div class="section-title">
							<h3 class="title"><?= __('About') ?> <a href="<?= site('url_language') ?>/author/<?= $author->id ?>"><?= $page->author_name ?></a></h3>
						</div>
						<div class="author media">
							<div class="media-left">
								<a href="<?= site('url_language') ?>/author/<?= $author->id ?>">
									<img class="author-img media-object" src="<?= site('url') ?>/<?= placeholder_avatar($author->avatar) ?>" alt="<?= $page->author_name ?>">
								</a>
							</div>
							<div class="media-body">
								<p><?= $author->about ?></p>
								<?php if(!empty($author_socials)): ?>
									<ul class="author-social">
										<?php foreach($author_socials as $social): ?>
											<li><a href="<?= html($social->link) ?>" target="_blank"><i class="fa fa-<?= $social->type ?>"></i></a></li>
										<?php endforeach; ?>
									</ul>
								<?php endif; ?>
							</div>
						</div>
					</div>
				<?php endif; ?>

				<?php Theme::widget('related-posts'); ?>

				<?php Theme::widget('comments'); ?>
			</div>
			<div class="col-md-4">
				<?php Theme::sidebar(); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
