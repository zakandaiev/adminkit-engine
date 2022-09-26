(function($) {
	"use strict"

	// Mobile dropdown
	$('.has-dropdown>a').on('click', function() {
		$(this).parent().toggleClass('active');
	});

	// Aside Nav
	$(document).click(function(event) {
		if (!$(event.target).closest($('#nav-aside')).length) {
			if ( $('#nav-aside').hasClass('active') ) {
				$('#nav-aside').removeClass('active');
				$('#nav').removeClass('shadow-active');
			} else {
				if ($(event.target).closest('.aside-btn').length) {
					$('#nav-aside').addClass('active');
					$('#nav').addClass('shadow-active');
				}
			}
		}
	});

	$('.nav-aside-close').on('click', function () {
		$('#nav-aside').removeClass('active');
		$('#nav').removeClass('shadow-active');
	});


	$('.search-btn').on('click', function() {
		$('#nav-search').toggleClass('active');
	});

	$('.search-close').on('click', function () {
		$('#nav-search').removeClass('active');
	});

	// Parallax Background
	$.stellar({
		responsive: true
	});

	// Comment reply
	$('[data-coment-reply]').on('click', function (event) {
		event.preventDefault();

		if ($(this).attr('data-coment-reply-active')) {
			$(this).text($(this).attr('data-coment-reply-active'));
			$(this).removeAttr('data-coment-reply-active');
			$('[name="parent"]').val('');
		} else {
			$(this).attr('data-coment-reply-active', $(this).text());
			$('[name="parent"]').val($(this).attr('data-coment-reply'));
			$(this).text('Cancel reply');
		}
	});
})(jQuery);
