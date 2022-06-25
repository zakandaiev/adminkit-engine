document.querySelectorAll('textarea[class*="wysiwyg"]').forEach(textarea => {
		textarea.classList.add("hidden");

		const wysiwyg_node = document.createElement('div');
		const quill_node = document.createElement('div');
		quill_node.innerHTML = textarea.value;

		wysiwyg_node.classList.add('wysiwyg');
		wysiwyg_node.appendChild(quill_node);
		textarea.after(wysiwyg_node);

		let quill_icons = Quill.import('ui/icons');
		quill_icons['expand'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="maximize feather feather-maximize align-middle"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="minimize feather feather-minimize align-middle"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>';

		const quill = new Quill(quill_node, {
			modules: {
				toolbar: {
						container: [
							[{ header: [false, 3, 2] }],
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
								const expand = wysiwyg_node.querySelector('.ql-expand');

								function maximize() {
									wysiwyg_node.classList.add('fullscreen');
									if(expand) expand.classList.add('active');
								}
								function minimize() {
									wysiwyg_node.classList.remove('fullscreen');
									if(expand) expand.classList.remove('active');
								}

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
					formData.append(SETTING.csrf.key, SETTING.csrf.token);

					quill.enable(false);

					fetch(BASE_URL + '/upload/', {method: 'POST', body: formData})
					.then(response => response.text())
					.then(data => {
						const selection = quill.getSelection().index;
						const image_url = BASE_URL + '/' + data;

						quill.insertEmbed(selection, 'image', image_url);
						quill.setSelection(selection + 1);
					})
					.catch(error => {
						SETTING.toast('error', error);
					})
					.finally(() => {
						quill.enable(true);
					});
				}
			};
		}

		textarea.quill = quill;
});
