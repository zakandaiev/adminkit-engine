SETTING.loader = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
SETTING.image_placeholder = BASE_URL + '/module/Admin/View/Asset/img/no_image.jpg';
SETTING.toast = function(status, message = null, duration = null) {
	toast(status, message, duration);
};
