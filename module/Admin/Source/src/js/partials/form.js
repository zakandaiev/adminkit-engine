FORMS.forEach(form => {
	form.insertAdjacentHTML('beforeend', LOADER);

	formBehavior(form);

	form.addEventListener('submit', event => {
		event.preventDefault();
		
		disableForm(form);

		let formData = new FormData(form);

		fetch(form.action, {method: 'POST', body: formData})
		.then(response => response.json())
		.then(data => {
			if(data.status === 'success') {
				if(form.hasAttribute('data-redirect')) {
					const redirect = form.getAttribute('data-redirect');
					if(redirect === 'this') {
						document.location.reload();
					} else {
						window.location.href = redirect;
					}
				}
				if(form.hasAttribute('data-reset')) {
					form.reset();
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

function formBehavior(form) {
	const controls = form.querySelectorAll('[data-behavior]');

	function hideItems(control) {
		let hide = control.getAttribute('data-hide');
		if(control.getAttribute('type') === 'checkbox' && !control.checked) {
			if(hide) {
				hide += ',' + control.getAttribute('data-show');
			} else {
				hide = control.getAttribute('data-show');
			}
		}
		if(control.getAttribute('type') === 'radio' && !control.checked) {
			hide = null;
		}
		if(hide) {
			hide.split(',').forEach(to_hide => {
				const item = form.querySelector('[name="' + to_hide + '"]');
				const parent = item.parentElement;
				if(parent.classList.contains('form-control')) {
					parent.classList.add('hidden');
				} else {
					item.classList.add('hidden');
				}
			});
		}
	}

	function showItems(control) {
		let show = control.getAttribute('data-show');
		if(control.getAttribute('type') === 'checkbox' && !control.checked) {
			show = null;
		}
		if(control.getAttribute('type') === 'radio' && !control.checked) {
			show = null;
		}
		if(show) {
			show.split(',').forEach(to_show => {
				const item = form.querySelector('[name="' + to_show + '"]');
				const parent = item.parentElement;
				if(parent.classList.contains('form-control')) {
					parent.classList.remove('hidden');
				} else {
					item.classList.remove('hidden');
				}
			});
		}
	}
	
	controls.forEach(control => {
		// on form init
		if(control.getAttribute('data-behavior') === 'visibility') {
			hideItems(control);
			showItems(control);
		}
		// on form change
		control.addEventListener('change', event => {
			if(control.getAttribute('data-behavior') === 'visibility') {
				hideItems(control);
				showItems(control);
			}
			if(control.getAttribute('data-behavior') === 'cyr_to_lat') {
				if(control.hasAttribute('data-target')) {
					control.getAttribute('data-target').split(',').forEach(target => {
						const target_item = form.querySelector('[name='+target+']');
						if(target_item) {
							target_item.value = cyr_to_lat(control.value);
						}
					});
				} else {
					control.value = cyr_to_lat(control.value);
				}
			}
			if(control.getAttribute('data-behavior') === 'slug') {
				if(control.hasAttribute('data-target')) {
					control.getAttribute('data-target').split(',').forEach(target => {
						const target_item = form.querySelector('[name='+target+']');
						if(target_item) {
							target_item.value = slug(control.value);
						}
					});
				} else {
					control.value = slug(control.value);
				}
			}
		});
	});
}

function disableForm(form) {
	form.classList.add('submit');
	form.querySelector('[type="submit"]').disabled = true;
}
function enableForm(form) {
	form.classList.remove('submit');
	form.querySelector('[type="submit"]').disabled = false;
}

// DELETE BUTTONS
const delete_buttons = document.querySelectorAll('[data-delete]');

delete_buttons.forEach(button => {
	button.addEventListener('click', event => {
		event.preventDefault();
		
		button.disabled = true;

		if(!button.hasAttribute('data-delete')) {
			return;
		}

		let confirmation = true;
		if(button.hasAttribute('data-confirm')) {
			confirmation = confirm(button.getAttribute('data-confirm'));
		}
		if(!confirmation) {
			return;
		}

		fetch(button.getAttribute('data-delete'), {method: 'POST'})
		.then(response => response.json())
		.then(data => {
			if(data.status === 'success') {
				// Redirect
				if(button.hasAttribute('data-redirect')) {
					const redirect = button.getAttribute('data-redirect');
					if(redirect === 'this') {
						document.location.reload();
					} else {
						window.location.href = redirect;
					}
				}
				// Tables
				if(button.parentElement.classList.contains('table-action')) {
					// button.parentElement.parentElement.remove();
					function fadeOut(el) {
						el.style.opacity = 1;
						(function fade() {
							if ((el.style.opacity -= .1) < 0) {
								el.style.display = "none";
							} else {
								requestAnimationFrame(fade);
							}
						})();
					};
					fadeOut(button.parentElement.parentElement);
				}
				// Counter
				if(button.hasAttribute('data-counter')) {
					const counter = document.querySelector(button.getAttribute('data-counter'));
					counter.textContent = parseInt(counter.textContent) - 1;
				}
			}

			makeAlert(data.status, data.message);
		})
		.catch(error => {
			makeAlert('error', error);
		});

		button.disabled = false;
	});
});