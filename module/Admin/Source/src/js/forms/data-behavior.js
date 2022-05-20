class DataBehabior {
	constructor(node, options = {}) {
		this.node = node;
		this.options = options;
	}

	initialize() {}
}

document.querySelectorAll('[data-behavior]').forEach(element => {
	new DataBehabior.node(element, {
		data: [
			// {key: 'key', value: 'value'}
			{key: SETTING.csrf.key, value: SETTING.csrf.token},
		]
	});
});
