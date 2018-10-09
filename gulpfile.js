const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

// npm uninstall any unused packages (probably csswring)

// postcss will definitely be used
// csswring and gulp-clean-css are both css minifiers
// gulp-sass is used for compiling scss to css
// postcss-preset-env is like Babel for css

// "autoprefixer": "^9.1.5",
//     "csswring": "^7.0.0",
//     "gulp": "^3.9.1",
//     "gulp-clean-css": "^3.10.0",
//     "gulp-sass": "^4.0.1",
//     "postcss": "^7.0.5",
//     "postcss-preset-env": "^6.0.10"

gulp.task('serve', ['styles', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: './app',
    },
  });

  gulp.watch('app/**/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['js']);
});

// Deal with HTML files
gulp.task('html', function() {
  return gulp.src('app/**/*.html').pipe(gulp.dest('dist'));
});

// Deal with SCSS files
gulp.task('styles', function() {
  return gulp
    .src('app/styles/*.scss')
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 versions'],
        }),
      ])
    )
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

// Deal with JavaScript files
gulp.task('js', function() {
  return gulp
    .src('app/js/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// Default task to run all other tasks
gulp.task('default', ['html', 'styles', 'js']);

// Watch task for changes to any HTML, SCSS, JS files
gulp.task('watch', function() {
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['js']);
});
