document.querySelectorAll('[data-action]').forEach(form => {
	form.addEventListener('click', event => {
		event.preventDefault();

		if(!confirmForm(form)) {
			return;
		}

		disableForm(form);

		return;

		if(form.hasAttribute('data-form')) {
			let formData = new FormData(document.querySelector(form.getAttribute('data-form')));
		} else {
			let formData = new FormData();
		}

		formData.set(SETTING.csrf.key, SETTING.csrf.token);

		fetch(form.getAttribute('data-action'), {
			method: form.hasAttribute('data-method') ? form.getAttribute('data-method') : 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if(data.status === 'success') {
				// Redirect
				if(form.hasAttribute('data-redirect')) {
					const redirect = form.getAttribute('data-redirect');
					if(redirect === 'this') {
						document.location.reload();
					} else {
						window.location.href = redirect;
					}
				}
				// Tables
				if(form.parentElement.classList.contains('table-action')) {
					// form.parentElement.parentElement.remove();
					function fadeOut(el) {
						el.style.opacity = 1;
						(function fade() {
							if((el.style.opacity -= .1) < 0) {
								el.style.display = "none";
							} else {
								requestAnimationFrame(fade);
							}
						})();
					};
					fadeOut(form.parentElement.parentElement);
				}
				// Counter
				if(form.hasAttribute('data-counter')) {
					const counter = document.querySelector(form.getAttribute('data-counter'));
					counter.textContent = parseInt(counter.textContent) - 1;
				}
			}

			makeAlert(data.status, data.message);
		})
		.catch(error => {
			makeAlert('error', error);
		});

		enableForm(form);
	});
});

function confirmForm(form) {
	let confirmation = true;

	if(form.hasAttribute('data-confirm')) {
		confirmation = confirm(form.getAttribute('data-confirm'));
	}

	return confirmation;
}

function disableForm(form) {
	// DISABLE
	form.setAttribute('disabled', 'disabled');

	// ADD CLASS
	if(form.hasAttribute('data-class') && form.hasAttribute('data-class-target')) {
		document.querySelectorAll(form.getAttribute('data-class-target')).forEach(target => {
			target.classList.add(form.getAttribute('data-class'));
		});
	}
	else if(form.hasAttribute('data-class')) {
		form.classList.add(form.getAttribute('data-class'));
	}
}

function enableForm(form) {
	// ENABLE
	form.removeAttribute('disabled');

	// REMOVE CLASS
	if(form.hasAttribute('data-class') && form.hasAttribute('data-class-target')) {
		document.querySelectorAll(form.getAttribute('data-class-target')).forEach(target => {
			target.classList.remove(form.getAttribute('data-class'));
		});
	}
	else if(form.hasAttribute('data-class')) {
		form.classList.remove(form.getAttribute('data-class'));
	}
}
