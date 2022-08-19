class ForeignForm {
	constructor(node) {
		this.is_edit = false;
		this.active_row = null;

		this.uid = this.generateUid();

		this.initStore(node);
		this.initModal();
		this.initButtons();
		this.initTable();
		this.populateTable();
		this.updateStore();
		this.render();
	}

	generateUid() {
		return 'ff-' + Math.random().toString(36).slice(2);
	}

	initStore(node) {
		this.store = node;
		this.name = this.store.name;
		this.value = this.store.value;

		this.store.setAttribute('data-id', this.uid);
		this.store.setAttribute('type', 'hidden');
		this.store.classList.add('hidden');

		this.store.textContent = '';

		return true;
	}

	initModal() {
		this.modal = this.store.nextElementSibling;
		this.inputs = this.modal.querySelectorAll('[name]');

		this.inputs.forEach(input => {
			input.name = input.name.replace('[]', '');
		});

		setTimeout(() => {
			this.inputs.forEach(input => {
				if (input.type === 'file') {
					this.initFileInput(input);
				}
			});
		}, 1000);

		this.modal.setAttribute('id', this.uid);

		const bs = new bootstrap.Modal(this.modal);
		this.modal.bs = bs;
		this.modal.addEventListener('hidden.bs.modal', () => this.buttonClick('cancel'));

		return true;
	}

	initFileInput(input) {
		input?.pond?.setOptions({
			instantUpload: true,
			allowRevert: true,
			server: {
				process: {
					url: '/upload/',
					ondata: formData => {
						formData.set(SETTING.csrf.key, SETTING.csrf.token);
						return formData;
					}
				},
				revert: {
					url: '/upload/',
					ondata: formData => {
						formData.set(SETTING.csrf.key, SETTING.csrf.token);
						return formData;
					}
				}
			}
		});

		return true;
	}

	initButtons() {
		this.submit = this.modal.querySelector('[type="submit"]');
		this.submit.addEventListener('click', event => this.buttonClick('submit', event));

		this.add = document.createElement('span');

		this.add.setAttribute('data-bs-toggle', 'modal');
		this.add.setAttribute('data-bs-target', '#' + this.uid);
		this.add.classList.add('badge', 'bg-primary', 'cursor-pointer');
		this.add.innerHTML = SETTING.icon.add;
		this.add.addEventListener('click', () => this.buttonClick('add'));

		return true;
	}

	updateButtons() {
		const add = this.submit.querySelector('.add');
		const edit = this.submit.querySelector('.edit');

		if (this.is_edit) {
			if (add) {
				add.style.display = 'none';
			}
			if (edit) {
				edit.style.display = 'initial';
			}
		} else {
			if (add) {
				add.style.display = 'initial';
			}
			if (edit) {
				edit.style.display = 'none';
			}
		}

		return true;
	}

	initTable() {
		this.table = document.createElement('table');
		this.thead = document.createElement('thead');
		this.tbody = document.createElement('tbody');

		this.table.classList.add('table');
		this.table.classList.add('table-sm');
		this.table.classList.add('foreign-form__table');

		this.createThead();

		this.tbody.classList.add('sortable');
		this.tbody.setAttribute('data-handle', '.sortable__handle');
		this.tbody.onEnd = () => this.updateStore();

		return true;
	}

	createThead() {
		const trow = document.createElement('tr');

		this.inputs.forEach(input => {
			const tcol = document.createElement('th');

			tcol.innerText = input.getAttribute('data-label');

			trow.appendChild(tcol);
		});

		const tcol = document.createElement('th');
		tcol.classList.add('table-action');
		tcol.appendChild(this.add);
		trow.appendChild(tcol);

		this.thead.appendChild(trow);

		return true;
	}

	populateTable() {
		if (!this.value) {
			return false;
		}

		const values = JSON.parse(this.value);

		values.forEach(value => {
			this.active_row = this.createRow();
			this.updateRow(value);
			this.tbody.appendChild(this.active_row);
		});

		return true;
	}

	updateStore() {
		let data = [];

		this.tbody.querySelectorAll('tr').forEach(tr => {
			let obj = {};

			tr.querySelectorAll('td').forEach(td => {
				if (!td.hasAttribute('data-name')) {
					return false;
				}
				obj[td.getAttribute('data-name')] = td.getAttribute('data-value');
			});

			data.push(obj);
		});

		this.store.value = JSON.stringify(data);

		return true;
	}

	render() {
		this.table.appendChild(this.thead);
		this.table.appendChild(this.tbody);

		this.store.before(this.table);

		return true;
	}

	createRow() {
		const trow = document.createElement('tr');

		this.inputs.forEach(input => {
			const tcol = document.createElement('td');

			tcol.setAttribute('data-name', input.name);
			tcol.setAttribute('data-value', '');

			trow.appendChild(tcol);
		});

		const tcol = document.createElement('td');
		tcol.classList.add('table-action');

		const btn_sort = document.createElement('span');
		const btn_edit = document.createElement('span');
		const btn_delete = document.createElement('span');

		btn_sort.innerHTML = SETTING.icon.sort + ' '; btn_sort.classList.add('sortable__handle');
		btn_edit.innerHTML = SETTING.icon.edit + ' ';
		btn_delete.innerHTML = SETTING.icon.delete;

		btn_edit.addEventListener('click', () => this.buttonClick('edit', trow));
		btn_delete.addEventListener('click', () => this.buttonClick('delete', trow));

		tcol.append(btn_sort);
		tcol.append(btn_edit);
		tcol.append(btn_delete);

		trow.appendChild(tcol);

		return trow;
	}

	buttonClick(type, mixed = null) {
		switch (type) {
			case 'add': {
				this.is_edit = false;

				this.resetInputs();
				this.updateButtons();

				return true;
			}
			case 'edit': {
				this.active_row = mixed;
				this.is_edit = true;

				this.resetInputs();
				this.updateButtons(true);

				this.populateInputs();

				this.modal.bs.show();

				return true;
			}
			case 'delete': {
				this.is_edit = false;

				fadeOut(mixed, false, () => this.updateStore());

				return true;
			}
			case 'cancel': {
				this.is_edit = false;

				this.resetInputs();

				return true;
			}
			case 'submit': {
				mixed.preventDefault();

				if (!this.is_edit) {
					this.active_row = this.createRow();
				}

				const input_values = this.getInputsValue();

				if (!input_values) {
					return false;
				}

				this.updateRow(input_values);

				if (!this.is_edit) {
					this.tbody.appendChild(this.active_row);
				}

				this.updateStore();

				this.modal.bs.hide();

				return true;
			}
		}
	}

	updateRow(value) {
		if (!value) {
			return false;
		}

		this.inputs.forEach(input => {
			const tcol = this.active_row.querySelector(`[data-name="${input.name}"]`);

			if (!tcol) {
				return false;
			}

			this.setColValue(input, tcol, value[input.name]);
		});

		return true;
	}

	setColValue(input, tcol, value = null) {
		let output = value;

		switch (input.type) {
			case 'file': {
				output = '';

				let files = [];

				if (input.pond) {
					input.pond.getFiles().forEach(file => {
						if ([6, 8].includes(file.status)) {
							return false;
						}
						files.push(file.serverId);
					});
				}
				if (value && value[0] === '[') {
					files = files.concat(JSON.parse(value));
				}

				const gallery_uid = this.generateUid();

				files.forEach(file => {
					const file_name = file;
					const file_url = BASE_URL + '/' + file_name;
					const is_image = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(file_name?.split('.').pop().toLowerCase());

					if (is_image) {
						output += `<a href="${file_url}" target="_blank" data-fancybox="${gallery_uid}">${SETTING.icon.image}</a>`;
					} else {
						output += `<a href="${file_url}" target="_blank">${SETTING.icon.file}</a>`;
					}

					output += ' ';
				});

				value = JSON.stringify(files);

				break;
			}
			case 'select-one': {
				let selected = input?.slim?.selected() ?? (value ?? '');

				const option = input.querySelector('option[value="' + selected + '"]');
				if (option) output = option.text;

				value = selected;

				break;
			}
			case 'select-multiple': {
				let selected = input?.slim?.selected() ?? (JSON.parse(value) ?? []);

				let svalues = [];

				selected.forEach(sval => {
					const option = input.querySelector('option[value="' + sval + '"]');
					if (option) svalues.push(option.text);
				});

				output = svalues.join(', ');

				value = JSON.stringify(selected);

				break;
			}
			case 'checkbox': {
				if (input.checked) {
					output = SETTING.icon.checkbox_true ?? '+';
				} else {
					output = SETTING.icon.checkbox_false ?? '-';
				}

				value = input.checked;

				break;
			}
			case 'date': {
				output = new Date(value)?.toLocaleDateString();

				break;
			}
			case 'datetime-local': {
				output = new Date(value)?.toLocaleString();

				break;
			}
		}

		tcol.innerHTML = output;
		tcol.setAttribute('data-value', value ?? '');

		return true;
	}

	resetInputs() {
		this.inputs.forEach(input => {
			this.setInputValue(input, null);
		});

		return true;
	}

	populateInputs() {
		this.active_row.querySelectorAll('[data-name]').forEach(tcol => {
			this.inputs.forEach(input => {
				if (input.name === tcol.getAttribute('data-name')) {
					this.setInputValue(input, tcol.getAttribute('data-value'));
				}
			});
		});

		return true;
	}

	setInputValue(input, value = null) {
		switch (input.type) {
			case 'file': {
				let files = [];

				if (value) {
					JSON.parse(value).forEach(file => {
						let file_obj = {
							source: file,
							options: {
								type: 'local',
								metadata: {}
							}
						};

						if (pond_input_data.allowImagePreview(input)) {
							file_obj.options.metadata.poster = BASE_URL + '/' + file;
						}

						files.push(file_obj);
					});
				}

				input.pond.setOptions({
					files: files
				});

				break;
			}
			case 'select-one':
			case 'select-multiple': {
				input.selectedIndex = value ?? 0;

				if (!input.hasAttribute('data-native')) {
					if (input.type === 'select-multiple') {
						value = JSON.parse(value);
						value = value ?? [];
					}
					input.slim.set(value);
				}

				break;
			}
			case 'checkbox': {
				if (value && value == 'true') {
					input.checked = true;
				} else {
					input.checked = false;
				}

				break;
			}
			case 'textarea': {
				if (input.classList.contains('wysiwyg')) {
					input.quill.root.innerHTML = value;
				} else {
					input.value = value;
				}

				break;
			}
			default: input.value = value;
		}

		return true;
	}

	getInputsValue() {
		let value = {};
		let is_valid = true;

		this.inputs.forEach(input => {
			const value_lengh = input.value.replace(/(<([^>]+)>)/gi, '').length;

			if (input.hasAttribute('data-required') && value_lengh <= 0) {
				const sprintf = (str, ...argv) => !argv.length ? str :
					sprintf(str = str.replace(sprintf.token || "%", argv.shift()), ...argv);

				is_valid = false;
				let required_message = SETTING?.foreignForm?.required_message ?? '% is required';
				required_message = sprintf(required_message, input.getAttribute('data-label') ?? input.name);

				SETTING.toast('error', required_message);
			}

			value[input.name] = input.value;
		});

		return is_valid ? value : is_valid;
	}
}

document.querySelectorAll('[class*="foreign-form"]').forEach(element => {
	if (element.classList.contains('foreign-form')) {
		new ForeignForm(element);
	}
});
