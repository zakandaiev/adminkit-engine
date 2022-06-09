class ForeignForm {
	constructor(node) {
		this.node = node;
		this.name = node.getAttribute('data-name');
		this.value = node.getAttribute('data-value');
		this.inputs = node.querySelectorAll('[name]');
		this.button = {
			submit: node.querySelector('[type="submit"]'),
			open_modal: document.createElement('span')
		};
		this.icon = {
			add: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus align-middle feather-sm"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
			sort: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-move"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
			edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
			delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
		};
		this.uid = this.generateUid();
		this.store = document.createElement('textarea');
		this.table = document.createElement('table');
		this.thead = document.createElement('thead');
		this.tbody = document.createElement('tbody');
		this.is_editing = false;
		this.editing_row = null;

		this.initialize();
	}

	initialize() {
		// SET ID TO NODE
		this.node.setAttribute('id', this.uid);

		// SET UP MODAL BUTTON
		this.button.open_modal.setAttribute('data-bs-toggle', 'modal');
		this.button.open_modal.setAttribute('data-bs-target', '#' + this.uid);
		this.button.open_modal.classList.add('badge', 'bg-primary', 'cursor-pointer');
		this.button.open_modal.innerHTML = this.icon.add;
		this.button.open_modal.addEventListener('click', () => {
			if(!this.is_editing) {
				this.resetEditingRow();
			}
		});

		// SET UP STORE
		this.store.setAttribute('name', this.name);
		this.store.setAttribute('type', 'hidden');
		this.store.classList.add('hidden');

		// SET UP TABLE
		this.table.classList.add('table');
		this.table.classList.add('table-sm');
		this.table.classList.add('foreign-form__table');

		this.createThead();

		this.tbody.classList.add('sortable');
		new Sortable(this.tbody, {
			handle: '.sortable__handle',
			animation: 150,
			onSort: () => this.updateStore()
		});

		// SET UP SUMIT BUTTON
		this.button.submit.addEventListener('click', event => {
			event.preventDefault();

			this.clickSubmit();
			this.updateStore();
			this.resetEditingRow();
		});

		// RENDER
		this.populateTable();
		this.updateStore();
		this.render();

		// RESET EDITING ROW IF MODAL CANCELED
		this.node.addEventListener('hidden.bs.modal', () => this.resetEditingRow());

		setTimeout(() => {
			this.inputs.forEach(input => {
				if(input.type === 'file') {
					// console.log(input);
					input.pond.setOptions({
						instantUpload: true,
						server: {
							process: '/upload'
						}
					});
				}
			});
		}, 1000);


	}

	clickSubmit() {
		// EDIT ROW
		if(this.is_editing) {
			this.inputs.forEach(input => {
				this.editing_row.querySelector(`[data-name="${input.name}"]`).innerHTML = input.value;
			});

			this.resetEditingRow();

			return true;
		}

		// ADD ROW
		this.tbody.appendChild(this.createRow());

		return true;
	}

	updateStore() {
		let data = [];

		this.tbody.querySelectorAll('tr').forEach(tr => {
			let obj = {};

			tr.querySelectorAll('td').forEach(td => {
				if(!td.hasAttribute('data-name')) {
					return false;
				}
				obj[td.getAttribute('data-name')] = td.innerHTML;
			});

			data.push(obj);
		});

		this.store.value = JSON.stringify(data);

		return true;
	}

	resetEditingRow() {
		this.inputs.forEach(input => {
			if(input.tagName.toLowerCase() == 'select') {
				input.selectedIndex = 0;
				if(!input.hasAttribute('data-native')) {
					input.slim.set(input.value);
				}
			} else if(input.classList.contains('wysiwyg')) {
				input.quill.setContents([{insert: '\n'}]);
			} else {
				input.value = '';
			}
		});

		this.is_editing = false;
		this.editing_row = null;

		return true;
	}

	createRow(object = null) {
		const trow = document.createElement('tr');

		if(object) {
			for(const [key, value] of Object.entries(object)) {
				const tcol = document.createElement('td');

				tcol.setAttribute('data-name', key);
				tcol.innerHTML = value;

				trow.appendChild(tcol);
			}
		} else {
			this.inputs.forEach(input => {
				const tcol = document.createElement('td');

				tcol.setAttribute('data-name', input.name);
				tcol.innerHTML = input.value;

				trow.appendChild(tcol);
			});
		}

		const tcol_actions = document.createElement('td');
		tcol_actions.classList.add('table-action');

		const btn_sort = document.createElement('span');
		const btn_edit = document.createElement('span');
		const btn_delete = document.createElement('span');

		btn_sort.innerHTML = this.icon.sort + ' '; btn_sort.classList.add('sortable__handle');
		btn_edit.innerHTML = this.icon.edit + ' ';
		btn_delete.innerHTML = this.icon.delete;

		btn_edit.addEventListener('click', () => this.clickEdit(trow));
		btn_delete.addEventListener('click', () => this.clickDelete(trow));

		tcol_actions.append(btn_sort);
		tcol_actions.append(btn_edit);
		tcol_actions.append(btn_delete);

		trow.appendChild(tcol_actions);

		return trow;
	}

	clickEdit(trow) {
		this.inputs.forEach(input => {
			const value = trow.querySelector(`[data-name="${input.name}"]`).innerHTML;

			if(input.tagName.toLowerCase() == 'select' && !input.hasAttribute('data-native')) {
				input.slim.set(value);
			} else if(input.classList.contains('wysiwyg')) {
				input.quill.root.innerHTML = value;
			} else {
				input.value = value;
			}

			this.is_editing = true;
			this.editing_row = trow;

			this.button.open_modal.click();
		});
	}

	clickDelete(trow) {
		trow.remove();
		this.updateStore();
	}

	populateTable() {
		if(!this.value) {
			return true;
		}

		const values = JSON.parse(this.value);

		values.forEach(value => {
			this.tbody.appendChild(this.createRow(value));
		});

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
		tcol.appendChild(this.button.open_modal);
		trow.appendChild(tcol);

		this.thead.appendChild(trow);
	}

	render() {
		this.table.appendChild(this.thead);
		this.table.appendChild(this.tbody);

		this.node.before(this.store);
		this.node.before(this.table);

		return true;
	}

	generateUid() {
		return 'ff-' + Math.random().toString(36).slice(2);
	}
}
