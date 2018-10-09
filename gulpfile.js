const gulp = require('gulp');
const postcss = require('gulp-postcss');
// Compile SCSS to CSS
const sass = require('gulp-sass');
// Automatically add any browser prefixes to CSS
const autoprefixer = require('autoprefixer');
// Run a local server
const browserSync = require('browser-sync').create();
// Convert .pug to HTML
const pug = require('gulp-pug');
// npm uninstall any unused packages (probably csswring)

// csswring and gulp-clean-css are both css minifiers
// postcss-preset-env is like Babel for css

// *** FILE TASKS

// Build .pug files to the dist folder as HTML
gulp.task('pug', function() {
  return gulp
    .src('app/views/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Build HTML files to dist folder
gulp.task('html', function() {
  return gulp
    .src('app/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Build SCSS files to CSS files in dist folder
gulp.task('styles', function() {
  return (
    gulp
      .src('app/styles/*.scss')
      // Compile SCSS to CSS
      .pipe(sass())
      .pipe(
        postcss([
          // Add browser prefixes
          autoprefixer({
            browsers: ['last 2 versions'],
          }),
        ])
      )
      // Send compiled CSS to dist folder
      .pipe(gulp.dest('dist/styles'))
      // Hot reloading for browser-sync
      .pipe(browserSync.stream())
  );
});

// Compiles JS files to dist folder
gulp.task('js', function() {
  return (
    gulp
      .src('app/js/*.js')
      .pipe(gulp.dest('dist/js'))
      // Hot reloading for browser-sync
      .pipe(browserSync.stream())
  );
});

// Boot up browser-sync server
gulp.task('serve', ['styles', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  // Watch for file changes
  gulp.watch('app/*.html', ['html']);
  // gulp.watch('app/views/*.pug', ['pug']);
  gulp.watch('app/styles/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['js']);
});

// Default task to run all other tasks
gulp.task('default', ['html', 'styles', 'js']);

// Watch task for changes to any HTML, SCSS, JS files
gulp.task('watch', function() {
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['js']);
});
