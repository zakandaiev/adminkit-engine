const server = () => {
	$.browserSync.init({
		proxy: "admin.kit",
		/*server: {
			baseDir: $.path.root
		},*/
		//tunnel: true,
		notify: false,
		open: true
	});
}

module.exports = server;