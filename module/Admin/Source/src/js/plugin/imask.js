document.querySelectorAll('[data-mask]').forEach(element => {
	const maskOptions = {};
	const maskType = element.getAttribute('data-mask');

	maskOptions.lazy = element.hasAttribute('data-lazy') ? true : false;

	switch (maskType) {
		case 'tel':
		case 'phone': {
			maskOptions.mask = /^[\d\+\(\)-_ ]+$/;
			break;
		}
		default: {
			maskOptions.mask = maskType;
			break;
		}
	}

	const mask = IMask(element, maskOptions);

	element.mask = mask;
});
