<label class="form-label"><?= __('Socials') ?></label>
<textarea name="socials" class="foreign-form"><?= @$value ? json_encode($value) : '' ?></textarea>
<div class="modal fade">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><?= __('Add social') ?></h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label"><?= __('Social type') ?></label>
					<select name="type" data-placeholder="<?= __('Social') ?>" data-label="<?= __('Social type') ?>" data-required>
						<?php foreach(site('socials_allowed') as $social): ?>
							<option value="<?= strtolower($social ?? '') ?>"><?= ucfirst($social) ?></option>
						<?php endforeach; ?>
					</select>
				</div>
				<div class="mb-3">
					<label class="form-label"><?= __('Link') ?></label>
					<input type="url" name="link" placeholder="<?= __('Link') ?>" class="form-control" minlength="1" maxlength="200" data-label="<?= __('Link') ?>" data-required>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?= __('Cancel') ?></button>
				<button type="submit" class="btn btn-primary">
					<span class="add"><?= __('Add') ?></span>
					<span class="edit"><?= __('Edit') ?></span>
				</button>
			</div>
		</div>
	</div>
</div>
