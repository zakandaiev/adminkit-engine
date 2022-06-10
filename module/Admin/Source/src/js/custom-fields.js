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
			this.populateFile(value);
		} else {
			this.node.value = value;
		}

		return true;
	}

	populateFile(value = '') {
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
}

document.querySelectorAll('#page-custom-fields [name]').forEach(element => {
	if(element.name === 'custom_fields' || element.closest('.foreign-form__body')) {
		return false;
	}

	new CustomField(element);
});
