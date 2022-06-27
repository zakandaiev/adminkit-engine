class LoadMore {
	constructor(node, options = {}) {
		this.node = node;
		this.options = options;

		this.data_action = this.node.getAttribute('data-load-more');
		this.data_method = this.node.hasAttribute('data-method') ? this.node.getAttribute('data-method') : 'POST';
		this.data_event = this.node.hasAttribute('data-event') ? this.node.getAttribute('data-event') : 'click';
		this.data_target = this.node.getAttribute('data-target');
		this.data_target_position = this.node.hasAttribute('data-target-position') ? this.node.getAttribute('data-target-position') : 'beforeend';
		this.data_class = this.node.getAttribute('data-class');
		this.data_class_target = this.node.getAttribute('data-class-target');

		this.data_uri_key = this.node.hasAttribute('data-uri-key') ? this.node.getAttribute('data-uri-key') : 'page';
		this.data_page = this.node.hasAttribute('data-page') ? parseInt(this.node.getAttribute('data-page')) : 1;
		this.data_total = parseInt(this.node.getAttribute('data-total'));
		this.pagination_limit = parseInt(SETTING?.pagination_limit);

		this.data_output = null;

		if(this.data_page * this.pagination_limit >= this.data_total) {
			this.node.remove();
		}
		else if(this.data_action && this.data_target && this.data_total && this.pagination_limit) {
			this.initialize();
		}
	}

	initialize() {
		this.node.addEventListener(this.data_event, event => {
			event.preventDefault();

			this.disableNodes();

			const action = this.data_action + '?' + this.data_uri_key + '=' + ++this.data_page;

			fetch(action, {
				method: this.data_method,
				body: this.getFormData()
			})
			.then(response => response.text())
			.then(data => {
				this.data_output = data;
				this.output();
			})
			.catch(error => {
				SETTING.toast('error', error);
			})
			.finally(() => {
				this.enableNodes();
			});
		});
	}

	getFormData() {
		let data = new FormData();

		let options = [];

		if(this.options.data) {
			options = options.concat(this.options.data);
		}

		options.forEach(field => {
			if(field.key) {
				data.set(field.key, field.value ? field.value : null);
			}
		});

		return data;
	}

	disableNodes() {
		// DISABLE SELF
		this.node.setAttribute('disabled', 'disabled');
		this.node.classList.add('disabled');

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
		this.node.classList.remove('disabled');

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

	output() {
		const target = document.querySelector(this.data_target);

		if(!target || !this.data_output) {
			return false;
		}

		target.insertAdjacentHTML(this.data_target_position, this.data_output);

		feather?.replace();

		if(this.data_page * this.pagination_limit >= this.data_total) {
			fadeOut(this.node);
		}

		return true;
	}
}

document.querySelectorAll('[data-load-more]').forEach(element => {
	new LoadMore(element, {
		data: [
			{key: SETTING.csrf.key, value: SETTING.csrf.token}
		]
	});
});
