class Form {
	constructor(node, options = {}) {
		this.node = node;
		this.options = options;

		this.loader = options.loader ? options.loader : null;

		this.action = this.node.action;
		this.method = this.node.method ? this.node.method : 'POST';
		this.data_confirm = this.node.getAttribute('data-confirm');
		this.data_reset = this.node.hasAttribute('data-reset') ? true : false;
		this.data_class = this.node.getAttribute('data-class');
		this.data_redirect = this.node.getAttribute('data-redirect');
		this.data_message = this.node.getAttribute('data-message');

		if(this.action) {
			this.initialize();
		}
	}

	initialize() {
		if(this.loader) {
			this.node.insertAdjacentHTML('beforeend', this.loader);
		}

		this.node.addEventListener('submit', event => {
			event.preventDefault();

			if(!this.confirmation()) {
				return false;
			}

			this.disableForm();

			fetch(this.action, {
				method: this.method,
				body: this.getFormData()
			})
			.then(response => response.json())
			.then(data => {
				if(data.status === 'success') {
					this.successRedirect();
					this.successResetForm();
				}

				makeAlert(data.status, this.data_message ? this.data_message : data.message);
			})
			.catch(error => {
				makeAlert('error', error);
			});

			this.enableForm();
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
		let data = new FormData(this.node);

		if(this.options.data) {
			this.options.data.forEach(field => {
				if(field.key) {
					data.set(field.key, field.value ? field.value : null);
				}
			});
		}

		return data;
	}

	disableForm() {
		// DISABLE SELF
		this.node.setAttribute('disabled', 'disabled');
		this.node.classList.add('submit');
		this.node.querySelector('[type="submit"]').disabled = true;

		// ADD CLASS
		if(this.data_class) {
			this.node.classList.add(this.data_class);
		}

		return true;
	}

	enableForm() {
		// ENABLE SELF
		this.node.removeAttribute('disabled', 'disabled');
		this.node.classList.remove('submit');
		this.node.querySelector('[type="submit"]').disabled = false;

		// REMOVE CLASS
		if(this.data_class) {
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

	successResetForm() {
		if(this.data_reset) {
			this.node.reset();

			return true;
		}

		return false;
	}
}
