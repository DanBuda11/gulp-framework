const gulp = require('gulp');
const postcss = require('gulp-postcss');
// Compile SCSS to CSS
const sass = require('gulp-sass');
// Automatically add any browser prefixes to CSS
const autoprefixer = require('autoprefixer');
// Run a local server
const browserSync = require('browser-sync').create();
// For minifying CSS
const cleanCSS = require('gulp-clean-css');
// Babel for JS
const babel = require('gulp-babel');
// Minimize JS
const uglify = require('gulp-uglify');
// Minimize images
const imagemin = require('gulp-imagemin');

// npm uninstall any unused packages (probably csswring)
// csswring and gulp-clean-css are both css minifiers
// postcss-preset-env is like Babel for css

// *** FILE TASKS

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
      // minify CSS
      .pipe(cleanCSS({}))
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
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
      // Hot reloading for browser-sync
      .pipe(browserSync.stream())
  );
});

// Minify images and send to dist folder
gulp.task('images', function() {
  return gulp
    .src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

// *** SERVER TASK

// Boot up browser-sync server and run all file tasks
gulp.task('serve', ['html', 'styles', 'js', 'images'], function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  // Watch for file changes
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/styles/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['js']);
});

// *** RUN FILE TASKS WITHOUT SERVER

// Default task to run all file tasks
gulp.task('default', ['html', 'styles', 'js', 'images']);
