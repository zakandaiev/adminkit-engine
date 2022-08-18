document.querySelectorAll('a').forEach(anchor => {
	if (anchor.hasAttribute('data-bs-toggle') || !anchor.hasAttribute('href')) {
		return false;
	}

	anchor.addEventListener('click', event => {
		const anchor_href = event.currentTarget.getAttribute('href');

		if (anchor_href === '#') {
			event.preventDefault();
			smoothScrollToTop();
		}
		else if (anchor_href.charAt(0) === '#' || (anchor_href.charAt(0) === '/' && anchor_href.charAt(1) === '#')) {
			if (!event.currentTarget.hash) {
				return false;
			}

			const scroll_to_node = document.querySelector(event.currentTarget.hash);
			if (scroll_to_node) {
				event.preventDefault();
				smoothScroll(scroll_to_node);
			}
		}
	});
});