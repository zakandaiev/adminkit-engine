const pathSrc = "./src/";
const pathDest = "../";

module.exports = {
	root: pathDest,

	clear: [pathDest + "View/**"],

	php: {
		src: pathSrc + "php/**/*.{php,sql}",
		watch: pathSrc + "php/**/*.{php,sql}",
		dest: pathDest + "View"
	},

	sass: {
		src: pathSrc + "sass/*.{sass,scss}",
		watch: pathSrc + "sass/**/*.{sass,scss}",
		dest: pathDest + "View/Asset/css"
	},

	js: {
		src: pathSrc + "js/*.js",
		watch: pathSrc + "js/**/*.js",
		dest: pathDest + "View/Asset/js"
	},

	img: {
		src: pathSrc + "img/**/*.*",
		watch: pathSrc + "img/**/*.*",
		dest: pathDest + "View/Asset/img"
	},

	fonts: {
		src: pathSrc + "fonts/*.{woff2,ttf}",
		watch: pathSrc + "fonts/*.{woff2,ttf}",
		dest: pathDest + "View/Asset/fonts"
	},

	rootFiles: {
		src: pathSrc + "root-files/**/*.*",
		watch: pathSrc + "root-files/**/*.*",
		dest: pathDest + "View/Asset"
	}
};
