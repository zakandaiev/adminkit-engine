class CustomField {
	constructor(node) {
		this.node = node;

		this.name = this.node.getAttribute('name')?.replace('[]', '');
		this.store = document.querySelector('#page-custom-fields [name="custom_fields"]');

		if(this.name) {
			this.initialize();
		}
	}

	initialize() {
		const node_value = this.getStoreValue()[this.name];

		this.populateField(node_value);
	}

	getStoreValue() {
		return this.store?.value?.length ? JSON.parse(this.store.value) : {};
	}

	populateField(value = '') {
		if(this.node.getAttribute('type') === 'file') {
			if(!value || !value.length) {
				return false;
			}

			let files = [];
			let value_files = value[0] === '[' ? JSON.parse(value) : [value];

			value_files.forEach(file => {
				files.push({
						value: file,
						poster: BASE_URL + '/' + file
					}
				);
			});

			this.node.setAttribute('data-value', JSON.stringify(files));

			return true;
		}

		this.node.value = value;

		if(this.node.classList.contains('wysiwyg')) {
			this.node.quill.root.innerHTML = value;
		}

		return true;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('#page-custom-fields [name]').forEach(element => {
		if(element.getAttribute('name') !== 'custom_fields') {
			new CustomField(element);
		}
	});
});

document.querySelectorAll('#page-custom-fields [type="file"]').forEach(element => {
	new CustomField(element);
});
