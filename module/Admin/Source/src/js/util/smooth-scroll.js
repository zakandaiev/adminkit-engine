function smoothScroll(element) {
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth'
		});
	}
}

function smoothScrollTop() {
	window.scrollTo({
		behavior: 'smooth',
		top: 0
	});
}
