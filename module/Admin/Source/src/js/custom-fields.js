class CustomFields {
	constructor(node) {
		this.node = node;

		this.name = this.node.getAttribute('name');
		this.store = document.querySelector('#page-custom-fields [name="custom_fields"]');

		if(this.name && this.store) {
			this.initialize();
		}
	}

	initialize() {
		const node_value = this.getStoreValue()[this.name];

		this.populateField(node_value);
		this.updateStore(node_value);

		this.watchChanges();
	}

	getStoreValue() {
		return this.store.value?.length ? JSON.parse(this.store.value) : {};
	}

	populateField(value = '') {
		this.node.value = value;

		if(this.node.classList.contains('wysiwyg')) {
			this.node.quill.root.innerHTML = value;
		}

		return true;
	}

	updateStore(value = '') {
		let store_value = this.getStoreValue();

		store_value[this.name] = value;

		this.store.value = JSON.stringify(store_value);

		return true;
	}

	watchChanges() {
		this.node.addEventListener('change', () => {
			this.updateStore(this.node.value);
		});

		if(this.node.classList.contains('wysiwyg')) {
			this.node?.quill.on('editor-change', () => {
				this.updateStore(this.node.value);
			});
		}

		return true;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('#page-custom-fields [name]').forEach(element => {
		if(element.getAttribute('name') !== 'custom_fields') {
			new CustomFields(element);
		}
	});
});
