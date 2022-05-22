const BASE_URL = window.location.protocol + '//' + window.location.host;

// SETTING
@@include("setup/setting.js")

// UTILS
@@include("util/smoothScroll.js")

// CLASSES
@@include("form/form.js")
@@include("form/data-action.js")
@@include("form/data-behavior.js")
@@include("form/foreign_form.js")

document.addEventListener('DOMContentLoaded', () => {
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

	// RESPONSIVE TABLES
	@@include("setup/responsive-table.js")

	// SMOOTH SCROLL
	@@include("setup/anchor-smooth-scroll.js")
});

// HANDLE BROKEN IMAGES
@@include("setup/broken-images.js")
