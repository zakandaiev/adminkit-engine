document.querySelectorAll('textarea[class*="wysiwyg"]').forEach(textarea => {
	textarea.classList.add("hidden");

	const wysiwyg_node = document.createElement('div');
	const quill_node = document.createElement('div');
	quill_node.innerHTML = textarea.value;

	wysiwyg_node.classList.add('wysiwyg');
	wysiwyg_node.appendChild(quill_node);
	textarea.after(wysiwyg_node);

	const quill = new Quill(quill_node, {
		modules: {
			toolbar: {
					container: [
						[{ header: [2, 3, false] }],
						['bold', 'italic', 'underline', 'strike'],
						[{'align': []}, {'list': 'ordered'}, {'list': 'bullet'}],
						[{'color': []}, {'background': []}],
						['link', 'image', 'video', 'blockquote', 'code'],
						[{'indent': '-1'}, {'indent': '+1'}],
						[{'script': 'sub'}, {'script': 'super'}],
						['clean'], ['expand']
					],
					handlers: {
						'image': event => {
							uploadImage();
						},
						'expand': event => {
							wysiwyg_node.classList.contains('fullscreen') ?  minimize() : maximize();
						}
					}
			}
		},
		placeholder: textarea.placeholder,
		readOnly: textarea.disabled ? true : false,
		theme: 'snow'
	});

	// POPULATE
	// quill.setContents(JSON.parse(textarea.value).ops);

	// UPDATE TEXTAREA VALUE
	quill.on('editor-change', event => {
		// textarea.value = JSON.stringify(quill.getContents());
		textarea.value = quill.root.innerHTML;
	});

	// EXPAND BUTTON
	const expand = wysiwyg_node.querySelector('.ql-expand');
	function maximize() {
		wysiwyg_node.classList.add('fullscreen');
		if(expand) expand.classList.add('active');
	}
	function minimize() {
		wysiwyg_node.classList.remove('fullscreen');
		if(expand) expand.classList.remove('active');
	}

	// IMAGE UPLOAD
	const Image = Quill.import('formats/image');
	Image.className = 'image-fluid';
	Quill.register(Image, true);

	function uploadImage() {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = () => {
			const file = input.files[0];

			if(file) {
				let formData = new FormData();
				formData.append('file', file);

				quill.enable(false);

				fetch('/upload', {method: 'POST', body: formData})
				.then(response => response.json())
				.then(data => {
					if(data.status === 'success') {
						const selection = quill.getSelection().index;
						quill.insertEmbed(selection, 'image', BASE_URL + '/' + data.message);
						quill.setSelection(selection + 1);
					} else {
						makeAlert(data.status, data.message);
					}
				})
				.catch(error => {
					makeAlert('error', error);
				});

				quill.enable(true);
			}
		};
	}

});