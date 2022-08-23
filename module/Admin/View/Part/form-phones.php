<label class="form-label"><?= __('Phones') ?></label>
<textarea name="phones" class="foreign-form"><?= $settings->phones ?></textarea>
<div class="modal fade">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><?= __('Add phone') ?></h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label"><?= __('Phone') ?></label>
					<input type="tel" data-mask="tel" name="phone" placeholder="<?= __('Phone') ?>" class="form-control" minlength="10" maxlength="32" data-label="<?= __('Phone') ?>" data-required>
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
