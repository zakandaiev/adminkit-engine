document.querySelectorAll('[data-action]').forEach(form => {
	form.addEventListener('click', event => {
		event.preventDefault();

		if(!confirmForm(form)) {
			return;
		}

		disableForm(form);

		let formData = new FormData();

		if(form.hasAttribute('data-form')) {
			formData = new FormData(document.querySelector(form.getAttribute('data-form')));
		}

		formData.set(SETTING.csrf.key, SETTING.csrf.token);

		fetch(form.getAttribute('data-action'), {
			method: form.hasAttribute('data-method') ? form.getAttribute('data-method') : 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if(data.status === 'success') {
				successRedirect(form);
				successCounter(form);
				successResetTargetForm(form);
				successDeleteNodes(form);
			}

			makeAlert(data.status, form.hasAttribute('data-message') ? form.getAttribute('data-message') : data.message);
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

function successRedirect(form) {
	if(form.hasAttribute('data-redirect')) {
		const redirect = form.getAttribute('data-redirect');
		if(redirect === 'this') {
			document.location.reload();
		} else {
			window.location.href = redirect;
		}
	}

	return false;
}

function successCounter(form) {
	if(form.hasAttribute('data-counter')) {
		document.querySelectorAll(form.getAttribute('data-counter')).forEach(target => {
			const target_value = parseInt(target.textContent);
			target.textContent = target_value - 1;
		});

		return true;
	}

	return false;
}

function successResetTargetForm(form) {
	if(form.hasAttribute('data-form-reset')) {
		document.querySelectorAll(form.getAttribute('data-form-reset')).forEach(target => {
			target.reset();
		});

		return true;
	}

	return false;
}

function successDeleteNodes(form) {
	if(form.hasAttribute('data-delete')) {
		const target_value = form.getAttribute('data-delete');

		if(target_value === 'this') {
			fadeOut(form);

			return true;
		}

		if(target_value === 'trow') {
			const target = form.closest('tr');

			if(target) {
				fadeOut(target);
			}

			return true;
		}

		document.querySelectorAll(target_value).forEach(target => {
			// target.remove();
			fadeOut(target);
		});

		return true;
	}

	return false;
}

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
