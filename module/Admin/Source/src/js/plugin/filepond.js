const pond_input_data = {
	files: input => {
		let files = [];
		if(!input.hasAttribute('data-value')) {
			return files;
		}

		let input_files = input.getAttribute('data-value');

		if(!input_files || input_files == '[]') {
			return files;
		}

		input_files = JSON.parse(input_files);

		input_files.forEach(file => {
			let file_obj = {
				source: file.value,
				options: {
					type: 'local',
					metadata: {}
				}
			};

			if(pond_input_data.allowImagePreview(input)) {
				file_obj.options.metadata.poster = file.poster;
			}

			files.push(file_obj);
		});

		return files;
	},
	allowImagePreview: input => {
		return input.getAttribute('data-preview') == 'false' ? false : true;
	},
	maxTotalFileSize: input => {
		return input.hasAttribute('data-max-total-size') ? input.getAttribute('data-max-total-size') : null;
	},
	maxFileSize: input => {
		return input.hasAttribute('data-max-size') ? input.getAttribute('data-max-size') : null;
	},
	maxFiles: input => {
		return input.hasAttribute('data-max-files') ? parseInt(input.getAttribute('data-max-files')) : null;
	},
	styleItemPanelAspectRatio: input => {
		return input.hasAttribute('data-aspect-ratio') ? parseInt(input.getAttribute('data-aspect-ratio')) : 0.5625;
	}
};

const file_inputs = document.querySelectorAll('input[type="file"]');

if(file_inputs) {
	file_inputs.forEach(input => {
		const pond = FilePond.create(
			input, {
				server: {load: '/'},
				storeAsFile: true,
				instantUpload: false,
				allowProcess: false,
				allowRevert: false,
				allowReorder: true,
				dropOnPage: true,
				dropOnElement: file_inputs.length == 1 ? false : true,
				files: pond_input_data.files(input),
				allowImagePreview: pond_input_data.allowImagePreview(input),
				maxTotalFileSize: pond_input_data.maxTotalFileSize(input),
				maxFileSize: pond_input_data.maxFileSize(input),
				maxFiles: pond_input_data.maxFiles(input),
				styleItemPanelAspectRatio: pond_input_data.styleItemPanelAspectRatio(input),
				credits: false
			}
		);

		if(input.hasAttribute('data-placeholder')) {
			pond.setOptions({
				labelIdle: input.getAttribute('data-placeholder')
			});
		}

		if(typeof LOCALE_FILEPOND !== 'undefined') {
			pond.setOptions(LOCALE_FILEPOND);
		}

		input.pond = pond;
	});
}
