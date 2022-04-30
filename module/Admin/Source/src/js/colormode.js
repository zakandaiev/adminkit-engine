function setColorMode(dark) {
	if(dark) {
		document.body.setAttribute('data-colormode', 'dark');
		localStorage.setItem('colormode', 'dark');
	} else {
		document.body.removeAttribute('data-colormode');
		localStorage.removeItem('colormode');
	}

	return true;
}

if(window.matchMedia && localStorage.getItem('colormode') === null) {
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;
	setColorMode(isDarkMode);

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		const isDarkMode = event.matches ? true : false;
		setColorMode(isDarkMode);
	});
} else {
	const isDarkMode = (localStorage.getItem('colormode') === 'dark') ? true : false;
	setColorMode(isDarkMode);
}

document.addEventListener('click', event => {
	if(!event.target.closest('.colormode')) {
		return false;
	}

	event.preventDefault();

	const isDarkMode = (localStorage.getItem('colormode') === 'dark') ? true : false;
	setColorMode(!isDarkMode);
});
