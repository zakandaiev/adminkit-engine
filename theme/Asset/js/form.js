class Form {
	constructor(node) {
		this.node = node;

		this.action = this.node.action;
		this.method = this.node.method ? this.node.method : 'POST';
		this.data_focus = this.node.getAttribute('data-focus') ?? '';
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

		this.focusElement();

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
					this.successRedirect(data);
					this.successResetForm();
					toast(data.status, this.data_message ?? data.message);
				} else {
					toast(data.status, data.message ?? this.data_message);
				}
			})
			.catch(error => {
				toast('error', error);
			})
			.finally(() => {
				this.enableForm();
			});
		});
	}

	focusElement() {
		if(!this.node.hasAttribute('data-focus')) {
			return false;
		}

		let focus_selector = '[name]';
		if(this.data_focus.length > 0) {
			focus_selector = '[name="' + this.data_focus + '"]';
		}

		const focus_element = this.node.querySelector(focus_selector);

		if(focus_element) {
			focus_element.focus();
		}

		return true;
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

	successRedirect(data) {
		if(this.data_redirect) {
			if(this.data_redirect === 'this') {
				document.location.reload();
			} else {
				window.location.href = decodeURI(this.data_redirect).replaceAll(/({\w+})/g, data?.message);
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

document.querySelectorAll('form').forEach(element => {
	new Form(element);
});

function toast(type, text, duration) {
	if(!text || !text.length) {
		return false;
	}

	let container = document.querySelector('.toasts');
	if(!container) {
		container = document.createElement('div');
		container.classList.add('toasts');
		document.body.appendChild(container);
	}

	let toast = document.createElement('div');
	toast.classList.add('toasts__item');
	if(type) {
		toast.classList.add(type);
	}

	let toast_icon = document.createElement('i');
	toast_icon.classList.add('toasts__icon');
	if(type) {
		toast_icon.classList.add(type);
	}

	let toast_text = document.createElement('span');
	toast_text.classList.add('toasts__text');
	toast_text.textContent = text;

	toast.appendChild(toast_icon);
	toast.appendChild(toast_text);

	container.appendChild(toast);

	toast.addEventListener('click', () => toast_remove(container, toast));

	setTimeout(() => toast_remove(container, toast), duration ? duration : 5000);

	function toast_remove(container, toast) {
		toast.classList.add('disappear');
		setTimeout(() => {
			toast.remove();
			if(container && container.childElementCount <= 0) {
				container.remove();
			}
		}, 500);
	}

	return true;
}
