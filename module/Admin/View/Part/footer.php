<script>
	const BASE_URL = <?= Request::$base ?>;

	SETTING.loader = '<div class="spinner-border text-primary" role="status"></div>';
	SETTING.image_placeholder = '<?= Asset::url() . '/img/no_image.jpg' ?>';
	SETTING.toast = function(status, message = null, duration = null) {
		toast(status, message, duration);
	};
</script>

</body>

</html>
