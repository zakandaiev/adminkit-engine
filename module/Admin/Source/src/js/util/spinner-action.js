document.querySelectorAll('.spinner-action').forEach(element => {
	if(SETTING.loader) {
		element.insertAdjacentHTML('beforeend', SETTING.loader);
	}
});
