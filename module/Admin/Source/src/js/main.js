// SETTINGS
const BASE_URL = window.location.protocol + '//' + window.location.host;

SETTING.loader = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
SETTING.image_placeholder = BASE_URL + '/module/Admin/View/Asset/img/no_image.jpg';

// FUNCTIONS
function SmoothScrollTo(element) {
	if(element) {
		element.scrollIntoView({
			behavior: 'smooth'
		});
	}
}

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
						SmoothScrollTo(scroll_to_node);
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
	@@include("partials/filepond.js")

	// QUILL
	@@include("partials/quill.js")

	// SLIMSELECT
	@@include("partials/slimselect.js")

	// SORTABLE
	@@include("partials/sortable.js")

	// TOASTS
	@@include("partials/toast.js")

	// FORMS
	@@include("partials/form.js")
	@@include("partials/fake_form.js")
	@@include("partials/foreign_form.js")
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
