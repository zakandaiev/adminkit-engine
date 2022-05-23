class DataAction {
	constructor(node, options = {}) {
		this.node = node;
		this.options = options;

		this.data_action = this.node.getAttribute('data-action');
		this.data_method = this.node.hasAttribute('data-method') ? this.node.getAttribute('data-method') : 'POST';
		this.data_confirm = this.node.getAttribute('data-confirm');
		this.data_form = this.node.getAttribute('data-form');
		this.data_form_reset = this.node.getAttribute('data-form-reset');
		this.data_class = this.node.getAttribute('data-class');
		this.data_class_target = this.node.getAttribute('data-class-target');
		this.data_redirect = this.node.getAttribute('data-redirect');
		this.data_counter = this.node.getAttribute('data-counter');
		this.data_delete = this.node.getAttribute('data-delete');
		this.data_message = this.node.getAttribute('data-message');

		if(this.data_action) {
			this.initialize();
		}
	}

	initialize() {
		this.node.addEventListener('click', event => {
			event.preventDefault();

			if(!this.confirmation()) {
				return false;
			}

			this.disableNodes();

			fetch(this.data_action, {
				method: this.data_method,
				body: this.getFormData()
			})
			.then(response => response.json())
			.then(data => {
				if(data.status === 'success') {
					this.successRedirect();
					this.successCounter();
					this.successResetTargetForm();
					this.successDeleteNodes();
				}

				makeAlert(data.status, this.data_message ? this.data_message : data.message);
			})
			.catch(error => {
				makeAlert('error', error);
			});

			this.enableNodes();
		});
	}

	confirmation() {
		let confirmation = true;

		if(this.data_confirm) {
			confirmation = confirm(this.data_confirm);
		}

		return confirmation;
	}

	getFormData() {
		let data = new FormData();

		if(this.data_form) {
			data = new FormData(document.querySelector(this.data_form));
		}

		if(this.options.data) {
			this.options.data.forEach(field => {
				if(field.key) {
					data.set(field.key, field.value ? field.value : null);
				}
			});
		}

		return data;
	}

	disableNodes() {
		// DISABLE SELF
		this.node.setAttribute('disabled', 'disabled');
		this.node.classList.add('submit');

		// ADD CLASS TO TARGETS
		if(this.data_class && this.data_class_target) {
			document.querySelectorAll(this.data_class_target).forEach(target => {
				target.classList.add(this.data_class);
			});
		}
		else if(this.data_class) {
			this.node.classList.add(this.data_class);
		}

		return true;
	}

	enableNodes() {
		// ENABLE SELF
		this.node.removeAttribute('disabled', 'disabled');
		this.node.classList.remove('submit');

		// REMOVE CLASS FROM TARGETS
		if(this.data_class && this.data_class_target) {
			document.querySelectorAll(this.data_class_target).forEach(target => {
				target.classList.remove(this.data_class);
			});
		}
		else if(this.data_class) {
			this.node.classList.remove(this.data_class);
		}

		return true;
	}

	successRedirect() {
		if(this.data_redirect) {
			if(this.data_redirect === 'this') {
				document.location.reload();
			} else {
				window.location.href = this.data_redirect;
			}
		}

		return false;
	}

	successCounter() {
		if(this.data_counter) {
			document.querySelectorAll(this.data_counter).forEach(target => {
				const target_value = parseInt(target.textContent);
				target.textContent = target_value - 1;
			});

			return true;
		}

		return false;
	}

	successResetTargetForm() {
		if(this.data_form_reset) {
			document.querySelectorAll(this.data_form_reset).forEach(target => {
				target.reset();
			});

			return true;
		}

		return false;
	}

	successDeleteNodes() {
		if(!this.data_delete) {
			return false;
		}

		if(this.data_delete === 'this') {
			fadeOut(this.node);

			return true;
		}

		if(this.data_delete === 'trow') {
			const trow = this.node.closest('tr');

			if(trow) {
				fadeOut(trow);
			}

			return true;
		}

		document.querySelectorAll(this.data_delete).forEach(target => {
			fadeOut(target);
		});

		return true;
	}
}
