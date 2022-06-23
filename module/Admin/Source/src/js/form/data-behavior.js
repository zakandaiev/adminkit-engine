class DataBehabior {
	constructor(node) {
		this.node = node;

		this.data_behavior = this.node.getAttribute('data-behavior');
		this.data_hide = this.node.getAttribute('data-hide');
		this.data_show = this.node.getAttribute('data-show');
		this.data_target = this.node.getAttribute('data-target');

		if(this.data_behavior) {
			this.initialize();
		}
	}

	initialize() {
		// on node init
		if(this.data_behavior === 'visibility') {
			this.hideItems();
			this.showItems();
		}

		// on node change
		this.node.addEventListener('change', event => {
			if(this.data_behavior === 'visibility') {
				this.hideItems();
				this.showItems();
			}
			if(this.data_behavior === 'cyrToLat') {
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
			}
			if(this.data_behavior === 'slug' || this.data_behavior === 'slug_') {
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
			}
		});
	}

	hideItems() {
		let hide = this.data_hide;

		if(this.node.getAttribute('type') === 'checkbox' && !this.node.checked) {
			if(hide) {
				hide += ',' + this.data_show;
			} else {
				hide = this.data_show;
			}
		}

		if(this.node.getAttribute('type') === 'radio' && !this.node.checked) {
			hide = null;
		}

		if(hide) {
			hide.split(',').forEach(to_hide => {
				const item = form.querySelector('[name="' + to_hide + '"]');
				const parent = item.parentElement;
				if(parent.classList.contains('form-control')) {
					parent.classList.add('hidden');
				} else {
					item.classList.add('hidden');
				}
			});
		}

		return true;
	}

	showItems() {
		let show = this.data_show;

		if(this.node.getAttribute('type') === 'checkbox' && !this.node.checked) {
			show = null;
		}

		if(this.node.getAttribute('type') === 'radio' && !this.node.checked) {
			show = null;
		}

		if(show) {
			show.split(',').forEach(to_show => {
				const item = form.querySelector('[name="' + to_show + '"]');
				const parent = item.parentElement;
				if(parent.classList.contains('form-control')) {
					parent.classList.remove('hidden');
				} else {
					item.classList.remove('hidden');
				}
			});
		}

		return true;
	}
}

document.querySelectorAll('[data-behavior]').forEach(element => {
	new DataBehabior(element);
});
