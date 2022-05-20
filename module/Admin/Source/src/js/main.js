// SETTINGS
const BASE_URL = window.location.protocol + '//' + window.location.host;

SETTING.loader = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
SETTING.image_placeholder = BASE_URL + '/module/Admin/View/Asset/img/no_image.jpg';

// UTILS
@@include("utils/smoothScroll.js")

// CLASSES
@@include("forms/form.js")
@@include("forms/data-action.js")
@@include("forms/data-behavior.js")
@@include("forms/foreign_form.js")

document.addEventListener('DOMContentLoaded', () => {
	// SMOOTH SCROLL
	document.querySelectorAll('a').forEach(anchor => {
		if(anchor.hasAttribute('target') && anchor.getAttribute('target') === '_blank') {
			anchor.setAttribute('rel', 'noopener noreferrer nofollow');
		}

		if(!anchor.hasAttribute('data-bs-toggle')) {
			anchor.addEventListener('click', event => {
				if(!event.currentTarget.hasAttribute('href')) {
					return;
				}

				const anchor_href = event.currentTarget.getAttribute('href');

				if(anchor_href.charAt(0) === '#' || (anchor_href.charAt(0) === '/' && anchor_href.charAt(1) === '#')) {
					if(!event.currentTarget.hash) {
						return;
					}

					const scroll_to_node = document.querySelector(event.currentTarget.hash);
					if(scroll_to_node) {
						event.preventDefault();
						smoothScroll(scroll_to_node);
					}
				}
			});
		}
	});

	// RESPONSIVE TABLES
	document.querySelectorAll('table').forEach(table => {
		if(!table.parentElement.classList.contains('table-responsive')) {
			table.outerHTML = '<div class="table-responsive">' + table.outerHTML + '</div>';
		}
	});

	// FILEPOND
	@@include("plugins/filepond.js")

	// QUILL
	@@include("plugins/quill.js")

	// SLIMSELECT
	@@include("plugins/slimselect.js")

	// SORTABLE
	@@include("plugins/sortable.js")

	// FORMS
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

window.onload = () => {
	// HANDLE BROKEN IMAGES
	const images = document.querySelectorAll("img");
	images.forEach(image => {
		if(image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
			image.src = SETTING.image_placeholder;
		}
	});
};
