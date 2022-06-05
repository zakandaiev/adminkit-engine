window.onload = () => {
	const images = document.querySelectorAll("img");

	images.forEach(image => {
		if(image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
			image.src = SETTING.image_placeholder;
		}
	});
};
