const slimselect_data = {
	addable: select => {
		if(!select.hasAttribute('data-addable')) {
			return false;
		}

		return (value) => {
			let val = value;

			switch(select.getAttribute('data-addable')) {
				case 'tag': {
					val = value.replaceAll(/[^\p{L}\d ]+/giu, '').replaceAll(/[\s]+/g, ' ').trim();
					break;
				}
				default: {
					val = value.replaceAll(/[\s]+/g, ' ').trim();
					break;
				}
			}

			return val;
		}
	},
	allowDeselect: select => {
		return select.querySelector('option[data-placeholder]') ? true : false;
	},
	deselectLabel: select => {
		return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-sm"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
	},
	hideSelectedOption: select => {
		return select.multiple ? true : false;
	},
	closeOnSelect: select => {
		return select.multiple ? false : true;
	},
	showSearch: select => {
		return (select.querySelectorAll('option').length > 10 || select.hasAttribute('data-addable')) ? true : false;
	},
	placeholder: select => {
		return select.hasAttribute('data-placeholder') ? select.getAttribute('data-placeholder') : null;
	},
	searchPlaceholder: select => {
		return select.hasAttribute('data-placeholder-search') ? select.getAttribute('data-placeholder-search') : null;
	},
	searchText: select => {
		return select.hasAttribute('data-placeholder-search-text') ? select.getAttribute('data-placeholder-search-text') : null;
	}
};

	document.querySelectorAll('select').forEach(select => {
		if(select.hasAttribute('data-native')) {
			return false;
		}

		new SlimSelect({
			select: select,
			addable: slimselect_data.addable(select),
			allowDeselect: slimselect_data.allowDeselect(select),
			deselectLabel: slimselect_data.deselectLabel(select),
			// hideSelectedOption: slimselect_data.hideSelectedOption(select), // not work with optgroups
			closeOnSelect: slimselect_data.closeOnSelect(select),
			showSearch: slimselect_data.showSearch(select),
			placeholder: slimselect_data.placeholder(select),
			placeholderText: slimselect_data.placeholder(select),
			searchPlaceholder: slimselect_data.searchPlaceholder(select),
			searchText: slimselect_data.searchText(select),
			showContent: "down"
		});
	});
