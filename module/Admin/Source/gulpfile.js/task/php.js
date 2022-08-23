const php = () => {
	return $.gulp.src($.path.php.src)
	.pipe($.gulp.dest($.path.php.dist))
	.pipe($.browserSync.stream());
}

module.exports = php;
