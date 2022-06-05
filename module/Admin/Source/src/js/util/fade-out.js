function fadeOut(element, soft = false, callback = '') {
	if(!element) {
		return false;
	}

	element.style.opacity = 1;

	(function fade() {
		if((element.style.opacity -= 0.1) < 0) {
			if(soft) {
				element.style.display = "none";
			} else {
				element.remove();
			}

			if(window[callback]) {
				window[callback]();
			}
		} else {
			requestAnimationFrame(fade);
		}
	})();

}
