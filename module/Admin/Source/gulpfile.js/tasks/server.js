const server = () => {
	$.browserSync.init({
		proxy: "cms",
		/*server: {
			baseDir: $.path.root
		},*/
		//tunnel: true,
		notify: false,
		open: true
	});
}

module.exports = server;