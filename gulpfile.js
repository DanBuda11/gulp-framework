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
// Only deal with files that have changed since the last run
const changed = require('gulp-changed');

// *** FILE TASKS

// Build HTML files to dist folder
gulp.task('html', function() {
  return gulp
    .src('src/*.{html,ico}')
    .pipe(changed('dist'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Build SCSS files to CSS files in dist folder
gulp.task('styles', function() {
  return (
    gulp
      .src('src/styles/*.scss')
      .pipe(changed('dist/styles'))
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
      .src('src/js/*.js')
      .pipe(changed('dist/js'))
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
    .src('src/images/*.{png,gif,jpg,jpeg}')
    .pipe(changed('dist/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

// *** SERVER TASK

// Boot up browser-sync server and hot reload when files change
gulp.task('serve', ['html', 'styles', 'js', 'images'], function() {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: './dist',
    },
  });

  // Watch for file changes
  gulp.watch('src/*.{html,ico}', ['html']);
  gulp.watch('src/styles/*.scss', ['styles']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/images/*.{png,gif,jpg,jpeg', ['images']);
});

// *** RUN FILE TASKS WITHOUT SERVER

// Default task to run all file tasks
gulp.task('default', ['html', 'styles', 'js', 'images']);
