document.querySelectorAll('[class*="sortable"]').forEach(element => {
	new Sortable(element, {
		multiDrag: true,
		handle: '.sortable__handle',
		filter: '.sortable__disabled',
		ghostClass: 'sortable__ghost',
		animation: 150,
		group: 'nested',
		fallbackOnBody: false,
		swapThreshold: 0.5,
	});
});
