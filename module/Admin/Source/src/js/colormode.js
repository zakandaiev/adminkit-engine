const COLORMODE = {
	body_attribute_key: 'data-colormode',
	storage_key: 'colormode',
	value_default: 'default',
	value_dark: 'dark'
};

function setColorMode(isDarkMode) {
	if(isDarkMode) {
		document.body.setAttribute(COLORMODE.body_attribute_key, COLORMODE.value_dark);
		localStorage.setItem(COLORMODE.storage_key, COLORMODE.value_dark);
	} else {
		document.body.setAttribute(COLORMODE.body_attribute_key, COLORMODE.value_default);
		localStorage.setItem(COLORMODE.storage_key, COLORMODE.value_default);
	}

	return true;
}

if(window.matchMedia && localStorage.getItem(COLORMODE.storage_key) === null) {
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;
	setColorMode(isDarkMode);

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		const isDarkMode = event.matches ? true : false;
		setColorMode(isDarkMode);
	});
} else {
	const isDarkMode = (localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value_dark) ? true : false;
	setColorMode(isDarkMode);
}

document.addEventListener('click', event => {
	if(!event.target.closest('.colormode')) {
		return false;
	}

	event.preventDefault();

	const isDarkMode = (localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value_dark) ? true : false;
	setColorMode(!isDarkMode);
});
