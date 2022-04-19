document.querySelectorAll('[class*="sortable"]').forEach(element => {
	new Sortable(element, {
		handle: '.sortable__handle',
		animation: 150
	});
});