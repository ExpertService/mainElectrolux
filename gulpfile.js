var gulp 			= require('gulp'),
	concat			= require('gulp-concat'),
	pug 			= require('gulp-pug'),
	sass 			= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	spritesmith 	= require("gulp.spritesmith"),
	browserSync  	= require('browser-sync').create(),
	devip 			= require('dev-ip');

var paths = {
  app: {
		src: './app',
		watch: './app/**/*.*'
	},
	pug: {
		src: 'dev/pug/index.pug',
		watch: ['dev/pug/**/*.*'],
		dest: './app/'
	},
	sass: {
		src: 'dev/sass/**/*.sass',
		dest: './app/css/'	
	},
	font: {
		src: 'dev/fonts/**/*.*',
		dest: './app/fonts/'
	},
	img: {
		src: ['dev/img/**/*.{png,jpg,gif}', '!dev/img/sprite/**/*'],
		dest: './app/img/',
		sprite: {
			src: 'dev/img/sprite/**/*',
			dest: {
				img: 'dev/img/',
				css: 'dev/sass/'
			}
		}
	},
	js: {
		src: 'dev/js/*.js',
		dest: './app/js/'	
	},
	lib: {
		js: {
			src: ['node_modules/jquery/dist/jquery.min.js',
				'node_modules/jquery.scrollbar/jquery.scrollbar.min.js',
				'node_modules/air-datepicker/dist/js/datepicker.min.js',
				'dev/libs/js/*.js'],
			dest: './app/js/'
		},
		css: {
			src: ['node_modules/jquery.scrollbar/jquery.scrollbar.css',
				'node_modules/air-datepicker/dist/css/datepicker.min.css',
				'dev/libs/css/*.css'],
			dest: './app/css/'
		}
	},
};

gulp.task('browser-sync', function() {
		browserSync.init({
				server: {
						baseDir: paths.app.dest
				},
				notify: false
		});
});

gulp.task('pug', function () {
	return gulp.src(paths.pug.src)
	.pipe(pug({
			pretty: true
	}))
	.pipe(gulp.dest(paths.pug.dest))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
	return gulp.src(paths.sass.src)
	.pipe(sass({
			baseDir: './app',
			outputStyle: 'expanded',
			includePaths: [require('bourbon').includePaths, 'node_modules/normalize.css/']
	}))
	.pipe(autoprefixer())
	.pipe(gulp.dest(paths.sass.dest))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('font', function () {
	return gulp.src(paths.font.src)
	.pipe(gulp.dest(paths.font.dest));
});

gulp.task('font-watch', gulp.series('font', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('sprite', function() {
	var spriteData = gulp.src(paths.img.sprite.src)
		.pipe(spritesmith({
			imgName: 'icons.png',
			cssName: '_sprite.sass',
			algorithm: 'top-down',
//			cssTemplate: 'stylus.template.mustache',
			// cssVarMap: function(sprite) {
			// 	sprite.name = 'icon-' + sprite.name;
			// }
	}));

	spriteData.img.pipe(gulp.dest(paths.img.sprite.dest.img));
	spriteData.css.pipe(gulp.dest(paths.img.sprite.dest.css));
});

gulp.task('img', function () {
	return gulp.src(paths.img.src)
//	.pipe(tinypng())
	.pipe(gulp.dest(paths.img.dest));
});

gulp.task('img-watch', gulp.series('img', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('js', function () {
	return gulp.src(paths.js.src)
	.pipe(gulp.dest(paths.js.dest));
});

gulp.task('js-watch', gulp.series('js', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('lib-js', function () {
	return gulp.src(paths.lib.js.src)
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest(paths.lib.js.dest));
});

gulp.task('lib-css', function () {
	return gulp.src(paths.lib.css.src)
	.pipe(concat('libs.min.css'))
	.pipe(gulp.dest(paths.lib.css.dest));
});

gulp.task('lib-watch', gulp.series( gulp.parallel('lib-js', 'lib-css'), function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('browser-sync', gulp.series(
	gulp.parallel('pug', 'sass', 'font', 'img', 'js', 'lib-js', 'lib-css'),	
	function() {
		browserSync.init({
				server: {
						baseDir: paths.app.src
				},
				host: devip(),
				notify: false,
				ui: false
		});
	}
));

gulp.task('watch', function () {
	gulp.watch(paths.pug.watch, 			gulp.series('pug'));
	gulp.watch(paths.sass.src, 				gulp.series('sass'));
	gulp.watch(paths.font.src, 				gulp.series('font-watch'));
	gulp.watch(paths.img.src, 				gulp.series('img-watch'));
	gulp.watch(paths.js.src, 				gulp.series('js-watch'));
	gulp.watch([paths.lib.js.src,
				paths.lib.css.src],			gulp.series('lib-watch'));
//	gulp.watch(paths.app.dest+'/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));
