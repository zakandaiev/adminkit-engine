const BASE_URL = window.location.protocol + '//' + window.location.host;

document.addEventListener('DOMContentLoaded', () => {
	// CONSTANTS
	const FORMS = document.querySelectorAll('form');
	const SELECTS = document.querySelectorAll('select');
	const LOADER = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

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
	@@include("partials/jsontable.js")
});

window.onload = () => {
	// HANDLE BROKEN IMAGES
	const images = document.querySelectorAll("img");
	images.forEach(image => {
		if(image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
			image.src = BASE_URL + '/module/Admin/Asset/img/no_image.jpg';
		}
	});
};