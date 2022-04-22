<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<h1 class="h3 mb-3"><?= __('sidebar', 'settings') ?> <i data-feather="arrow-right"></i> <?= __('setting', 'section_' . $section) ?></h1>

				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body">
								<form method="POST">
									<?php
										$settings->languages_allowed = json_decode($settings->languages_allowed) ?? [];
										$settings->socials_allowed = json_decode($settings->socials_allowed) ?? [];
									?>
									<div class="mb-3">
										<label class="form-label">Time zone</label>
										<select name="time_zone">
											<?php print_time_zones($settings->time_zone); ?>
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label">Language</label>
										<select name="language">
											<?php foreach(Module::get('languages') as $language): ?>
												<?php if(!$language['enabled']) continue; ?>
												<?php
													$selected_language = '';

													if($language['key'] === $settings->language) {
														$selected_language = 'selected';
													}
												?>
												<option value="<?= $language['key'] ?>" <?= $selected_language ?>><?= $language['title'] ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label">Languages allowed</label>
										<select name="languages_allowed[]" multiple>
											<?php foreach(Module::get('languages') as $language): ?>
												<?php if($language['key'] === $settings->language) continue; ?>
												<?php
													$selected_language = '';

													if(in_array($language['key'], $settings->languages_allowed)) {
														$selected_language = 'selected';
													}
												?>
												<option value="<?= $language['key'] ?>" <?= $selected_language ?>><?= $language['title'] ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label">Socials allowed</label>
										<select name="socials_allowed[]" multiple data-addable="tag">
											<?php foreach($settings->socials_allowed as $social): ?>
												<?php
													$selected_social = '';

													if(in_array($social, $settings->socials_allowed)) {
														$selected_social = 'selected';
													}
												?>
												<option value="<?= strtolower($social) ?>" <?= $selected_social ?>><?= ucfirst($social) ?></option>
											<?php endforeach; ?>
										</select>
									</div>
									<div class="form-check form-switch mb-3">
										<input class="form-check-input" type="checkbox" id="enable_registration" name="enable_registration" <?php if($settings->enable_registration == 'true'): ?>checked<?php endif; ?>>
										<label class="form-check-label" for="enable_registration">Enable registration</label>
									</div>
									<button type="submit" class="btn btn-primary">Submit</button>
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
