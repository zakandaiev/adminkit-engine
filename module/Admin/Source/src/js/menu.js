const mainMenu = document.querySelector('ul.list-group.sortable');
const addMenuItem = document.getElementById('menu-add-item');
const addMenuItemBlank = document.getElementById('menu-item-blank');

addMenuItem?.addEventListener('click', event => {
	event.preventDefault();

	const newItem = addMenuItemBlank.cloneNode(true);
	newItem.classList.remove('hidden');
	newItem.removeAttribute('id');

	mainMenu.appendChild(newItem);

	makeSortable(newItem.querySelector('.sortable'));
});

document.addEventListener('click', event => {
	const itemRemove = event.target.closest('.menu-item__icon');
	if(itemRemove && itemRemove.classList.contains('feather-trash')) {
		fadeOut(itemRemove.closest('.menu-list'), false, 'editMenuItems');
	}

	if(event.target.closest('[data-bs-toggle]') || event.target.closest('[data-bs-toggle]')) {
		event.preventDefault();
	}
});

document.addEventListener('focusout', event => {
	if(event.target.classList.contains('menu-item__input')) {
		editMenuItems();
	}
});

function editMenuItems() {
	const menuItems = JSON.stringify(formatMenuItems(getItems(mainMenu)));

	const spinner_body = document.querySelector('.spinner-action');
	spinner_body.classList.add('spinner-action_active');

	let data = new FormData();

	data.set('items', menuItems);
	data.set(SETTING.csrf.key, SETTING.csrf.token);

	fetch(spinner_body.getAttribute('data-menu-action'), {
		method: 'POST',
		body: data
	})
	.then(response => response.json())
	.then(data => {
		SETTING.toast(data.status, data.message);
	})
	.catch(error => {
		SETTING.toast('error', error);
	})
	.finally(() => {
		spinner_body.classList.remove('spinner-action_active');
	});
}

function getItems(menu) {
	let menuItems = [];

	menu.querySelectorAll('.menu-list').forEach(item => {
		let itemData = {
			name: '#',
			url: '#',
			parent: null,
			children: []
		};

		const parent_menu = item.closest('ul.list-group.sortable');

		if(parent_menu !== menu) {
			itemData.parent = getItemProp(parent_menu.previousElementSibling, 'name');
		}

		itemData.name = getItemProp(item, 'name');
		itemData.url = getItemProp(item, 'url');

		menuItems.push(itemData);
	});

	return menuItems;
}

function formatMenuItems(arr = []) {
	let map = {}, node, res = [], i;

	for(i = 0; i < arr.length; i += 1) {
		map[arr[i].name] = i;
		arr[i].children = [];
	};

	for(i = 0; i < arr.length; i += 1) {
		node = arr[i];

		if(node.parent) {
			arr[map[node.parent]].children.push(node);
		} else {
			res.push(node);
		};
	};

	return res;
}

function getItemProp(item, type = 'name') {
	switch(type) {
		case 'name': {
			return item.querySelector('.menu-item > input[name="name"]')?.value ?? '';
		}
		case 'url': {
			return item.querySelector('.menu-item > input[name="url"]')?.value ?? '';
		}
		default: {
			return null;
		}
	}
}
