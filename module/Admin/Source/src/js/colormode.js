const COLORMODE = {
	storage_key: 'colormode_admin',
	attribute_key: 'data-colormode',
	value: 'dark'
};

function setColorMode(dark) {
	if(dark) {
		document.body.setAttribute(COLORMODE.attribute_key, COLORMODE.value);
		localStorage.setItem(COLORMODE.storage_key, COLORMODE.value);
	} else {
		document.body.removeAttribute(COLORMODE.attribute_key);
		localStorage.removeItem(COLORMODE.storage_key);
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
	const isDarkMode = (localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value) ? true : false;
	setColorMode(isDarkMode);
}

document.addEventListener('click', event => {
	if(!event.target.closest('.colormode')) {
		return false;
	}

	event.preventDefault();

	const isDarkMode = (localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value) ? true : false;
	setColorMode(!isDarkMode);
});
