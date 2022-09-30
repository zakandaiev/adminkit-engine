<?php
	$page->title = __('Edit main settings');
	Breadcrumb::add(__('Settings'), '/admin/setting/' . $section);
	Breadcrumb::add(__('Main'));
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

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<div class="mb-3">
										<label class="form-label"><?= __('Default language') ?></label>
										<select name="language" data-placeholder="<?= __('Default language') ?>">
											<?php foreach(site('languages') as $language): ?>
												<?php
													$selected_language = '';

													if($language['key'] === $settings->language) {
														$selected_language = 'selected';
													}
												?>
												<option value="<?= $language['key'] ?>" <?= $selected_language ?>><?= $language['key'] ?>_<?= $language['region'] ?> - <?= $language['name'] ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label"><?= __('Socials allowed') ?></label>
										<select name="socials_allowed[]" multiple data-addable="tag" data-placeholder="<?= __('Socials allowed') ?>">
											<?php
												$settings->socials_allowed = json_decode($settings->socials_allowed) ?? [];
											?>
											<?php foreach($settings->socials_allowed as $social): ?>
												<?php
													$selected_social = '';

													if(in_array($social, $settings->socials_allowed)) {
														$selected_social = 'selected';
													}
												?>
												<option value="<?= strtolower($social ?? '') ?>" <?= $selected_social ?>><?= ucfirst($social) ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="enable_registration" name="enable_registration" <?php if($settings->enable_registration == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="enable_registration"><?= __('Enable registration') ?></label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="enable_password_restore" name="enable_password_restore" <?php if($settings->enable_password_restore == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="enable_password_restore"><?= __('Enable password restore') ?></label>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="moderate_comments" name="moderate_comments" <?php if($settings->moderate_comments == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="moderate_comments"><?= __('Moderate comments') ?></label>
									</div>
									<button type="submit" class="btn btn-primary"><?= __('Save') ?></button>
								</form>
							</div>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>
