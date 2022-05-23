function fadeOut(element) {
	if(!element) {
		return false;
	}

	element.style.opacity = 1;

	(function fade() {
		if((element.style.opacity -= 0.1) < 0) {
			element.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();

}
