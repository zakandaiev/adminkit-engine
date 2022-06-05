document.addEventListener('DOMContentLoaded', () => {
	// FORM
	document.querySelectorAll('form').forEach(element => {
		new Form(element, {
			loader: SETTING.loader,
			data: [
				{key: SETTING.csrf.key, value: SETTING.csrf.token}
			]
		});
	});

	// DATA-ACTION
	document.querySelectorAll('[data-action]').forEach(element => {
		new DataAction(element, {
			data: [
				{key: SETTING.csrf.key, value: SETTING.csrf.token}
			]
		});
	});

	// DATA-BEHAVIOR
	document.querySelectorAll('[data-behavior]').forEach(element => {
		new DataBehabior(element);
	});

	// FOREIGN FORM
	document.querySelectorAll('[class*="foreign-form"]').forEach(element => {
		new ForeignForm(element);
	});
});
