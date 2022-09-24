class Translation {
	constructor(node) {
		this.node = node;

		this.data_action = this.node.hasAttribute('data-action') ? this.node.getAttribute('data-action') : window.location.href;

		this.initialize();
	}

	initialize() {
		this.node.contentEditable = true;
		this.node.spellcheck = false;

		this.colorize();
		this.watchChanges();
	}

	colorize() {
		let content = this.node.innerText;

		// cause memory problems with big files - need to improve
		// content = content.replace(/^(.+)[\s]*(=)[\s]*(")([^"]*)(")$/gmiu, '<span class="translation__key">$1</span> <span class="translation__equals">$2</span> <span class="translation__quote">$3</span><span class="translation__value">$4</span><span class="translation__quote">$5</span>');

		content = content.replace(/^(^[;|#][^[\n]*)/gmiu, '<span class="translation__comment">$1</span>');

		this.node.innerHTML = content;

		return true;
	}

	watchChanges() {
		this.node.addEventListener('focusout', () => {
			this.postChanges();
			this.colorize();
		});

		return true;
	}

	postChanges() {
		this.node.closest('.spinner-action')?.classList.add('spinner-action_active');

		fetch(this.data_action, {
			method: 'POST',
			body: this.getFormData()
		})
		.then(response => response.json())
		.then(data => {
			SETTING.toast(data.status, data.message);
		})
		.catch(error => {
			SETTING.toast('error', error);
		})
		.finally(() => {
			this.node.closest('.spinner-action')?.classList.remove('spinner-action_active');
		});

		return true;
	}

	getFormData() {
		let data = new FormData();

		data.set('content', this.node.innerText);
		data.set(SETTING.csrf.key, SETTING.csrf.token);

		return data;
	}
}

document.querySelectorAll('.translation').forEach(element => {
	new Translation(element);
});
