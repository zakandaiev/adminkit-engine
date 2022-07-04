class DataBehabior {
	constructor(node) {
		this.node = node;

		this.data_behavior = this.node.getAttribute('data-behavior');
		this.data_event = this.node.hasAttribute('data-event') ? this.node.getAttribute('data-event') : 'change';
		this.data_hide = this.node.getAttribute('data-hide');
		this.data_show = this.node.getAttribute('data-show');
		this.data_target = this.node.getAttribute('data-target');

		if(this.data_behavior) {
			this.initialize();
		}
	}

	initialize() {
		// on init
		this.visibilityHide();
		this.visibilityShow();
		this.toLower();
		this.toUpper();
		this.cyrToLat();
		this.slug();

		// on {event}
		this.node.addEventListener(this.data_event, () => {
			this.visibilityHide();
			this.visibilityShow();
			this.toLower();
			this.toUpper();
			this.cyrToLat();
			this.slug();
		});
	}

	visibilityHide() {
		if(this.data_behavior !== 'visibility') {
			return false;
		}

		let hide = this.data_hide;

		if(this.node.type === 'checkbox' && !this.node.checked) {
			if(hide) {
				hide += ',' + this.data_show;
			} else {
				hide = this.data_show;
			}
		}

		if(this.node.type === 'radio' && !this.node.checked) {
			hide = null;
		}

		if(hide) {
			hide.split(',').forEach(to_hide => {
				const item = document.querySelector('[name="' + to_hide + '"]');

				if(!item) {
					return false;
				}

				const parent = item.parentElement;

				if(parent && parent.classList.contains('form-group')) {
					parent.classList.add('hidden');
				} else {
					item.classList.add('hidden');
				}
			});
		}

		return true;
	}

	visibilityShow() {
		if(this.data_behavior !== 'visibility') {
			return false;
		}

		let show = this.data_show;

		if(this.node.type === 'checkbox' && !this.node.checked) {
			show = null;
		}

		if(this.node.type === 'radio' && !this.node.checked) {
			show = null;
		}

		if(show) {
			show.split(',').forEach(to_show => {
				const item = document.querySelector('[name="' + to_show + '"]');

				if(!item) {
					return false;
				}

				const parent = item.parentElement;

				if(parent && parent.classList.contains('form-group')) {
					parent.classList.remove('hidden');
				} else {
					item.classList.remove('hidden');
				}
			});
		}

		return true;
	}

	toLower() {
		if(this.data_behavior !== 'lowercase') {
			return false;
		}

		if(this.data_target) {
			this.data_target.split(',').forEach(target => {
				const target_item = document.querySelector('[name='+target+']');
				if(target_item) {
					target_item.value = this.node.value.toLocaleLowerCase();
				}
			});
		} else {
			this.node.value = this.node.value.toLocaleLowerCase();
		}

		return true;
	}

	toUpper() {
		if(this.data_behavior !== 'uppercase') {
			return false;
		}

		if(this.data_target) {
			this.data_target.split(',').forEach(target => {
				const target_item = document.querySelector('[name='+target+']');
				if(target_item) {
					target_item.value = this.node.value.toLocaleUpperCase();
				}
			});
		} else {
			this.node.value = this.node.value.toLocaleUpperCase();
		}

		return true;
	}

	cyrToLat() {
		if(this.data_behavior !== 'cyrToLat') {
			return false;
		}

		if(this.data_target) {
			this.data_target.split(',').forEach(target => {
				const target_item = document.querySelector('[name='+target+']');
				if(target_item) {
					target_item.value = cyrToLat(this.node.value);
				}
			});
		} else {
			this.node.value = cyrToLat(this.node.value);
		}

		return true;
	}

	slug() {
		if(!this.data_behavior.includes('slug')) {
			return false;
		}

		if(this.data_target) {
			this.data_target.split(',').forEach(target => {
				const target_item = document.querySelector('[name='+target+']');
				if(target_item) {
					target_item.value = slug(this.node.value, (this.data_behavior === 'slug_') ? '_' : null);
				}
			});
		} else {
			this.node.value = slug(this.node.value, (this.data_behavior === 'slug_') ? '_' : null);
		}

		return true;
	}
}

document.querySelectorAll('[data-behavior]').forEach(element => {
	new DataBehabior(element);
});
