const BASE_URL = window.location.protocol + '//' + window.location.host;

// SETTING
@@include("setup/setting.js")

// UTILS
@@include("util/fadeOut.js")
@@include("util/smoothScroll.js")

// CLASSES
@@include("form/form.js")
@@include("form/data-action.js")
@@include("form/data-behavior.js")
@@include("form/foreign_form.js")

document.addEventListener('DOMContentLoaded', () => {
	// RESPONSIVE TABLES
	@@include("setup/responsive-table.js")

	// SMOOTH SCROLL
	@@include("setup/anchor-smooth-scroll.js")

	// TOOLTIP
	@@include("setup/bs-tooltip.js")

	// SPINNER ACTION
	@@include("setup/spinner-action.js")

	// FILEPOND
	@@include("setup/filepond.js")

	// QUILL
	@@include("setup/quill.js")

	// SLIMSELECT
	@@include("setup/slimselect.js")

	// SORTABLE
	@@include("setup/sortable.js")

	// FORMS
	@@include("setup/forms.js")
});

// HANDLE BROKEN IMAGES
@@include("setup/broken-images.js")
