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
