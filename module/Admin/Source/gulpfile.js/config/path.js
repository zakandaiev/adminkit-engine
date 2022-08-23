const pathSrc = './src/';
const pathDist = '../';

module.exports = {
	src: pathSrc,
	dist: pathDist,

	clear: [pathDist + 'View/**'],

	php: {
		src: pathSrc + 'php/**/*.{php,sql}',
		watch: pathSrc + 'php/**/*.{php,sql}',
		dist: pathDist + 'View'
	},

	sass: {
		src: pathSrc + 'sass/*.{sass,scss}',
		watch: pathSrc + 'sass/**/*.{sass,scss}',
		dist: pathDist + 'View/Asset/css'
	},

	js: {
		src: pathSrc + 'js/*.js',
		watch: pathSrc + 'js/**/*.js',
		dist: pathDist + 'View/Asset/js'
	},

	img: {
		src: pathSrc + 'img/**/*.*',
		watch: pathSrc + 'img/**/*.*',
		dist: pathDist + 'View/Asset/img'
	},

	font: {
		src: pathSrc + 'font/**/*.woff2',
		watch: pathSrc + 'font/**/*.woff2',
		dist: pathDist + 'View/Asset/font'
	},

	rootFiles: {
		src: pathSrc + 'root-files/**/*.*',
		watch: pathSrc + 'root-files/**/*.*',
		dist: pathDist + 'View/Asset'
	}
};
