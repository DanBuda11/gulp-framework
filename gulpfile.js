// Set up the architecture first with notes then start building them out
// Need tasks for css, js, html, images etc then need to watch each for changes and then // build - build should be a separate task split away from watching

// JS: Babel transpiling, minify, uglify, code split vendors, dev source maps
// CSS: sass, dev source maps?
// HTML: copy template and inject links/js/etc
// Distinguish between prod and dev?
// Image minification
// Browser sync
// Bundle analyzer
// Postcss
// Autoprefixer
// Cssnano
// Cache busting with hashed file names

// Imports
const { src, dest, series, parallel, watch } = require('gulp'),
  sass = require('gulp-sass'),
  del = require('del'),
  cleanCSS = require('gulp-clean-css'),
  postCSS = require('gulp-postcss'),
  stripComments = require('gulp-strip-comments'),
  babel = require('gulp-babel'),
  browsersync = require('browser-sync').create(),
  imagemin = require('gulp-imagemin');

function reload() {
  browsersync.reload();
}

// Handle HTML files
// Handle favicon set
function static() {
  return src('src/index.html')
    .pipe(dest('dist'))
    .pipe(browsersync.stream());
}

// Handle CSS/SCSS files
function styles() {
  return (
    src('src/styles/*.scss')
      .pipe(sass())
      .on('error', sass.logError)
      // .pipe(cleanCSS())
      // .pipe(postCSS())
      .pipe(dest('dist/styles'))
      .pipe(browsersync.stream())
  );
}

// Handle JS files
function scripts() {
  return src('src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(stripComments())
    .pipe(dest('dist/js'));
}

// Handle images
function images() {
  return src('src/images/*.{png,gif,jpg,jpeg.svg}')
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

// Handle dev server
function devServer(done) {
  browsersync.init({
    port: 8000,
    server: {
      baseDir: './dist',
    },
  });

  watch('./src/index.html', series(static));
  watch('./src/styles/*.scss', styles);
  watch('./src/js/*.js', scripts);
  watch('./src/images/*', images);
  // done();
}

// function watchFiles() {
//   watch('./src/index.html', static);
//   watch('./src/styles/*.scss', styles);
//   watch('./src/js/*.js', scripts);
//   watch('./src/images/*', images);
//   // watch('./src/*', static);
// }

// Wipe contents of dist folder
function clean() {
  return del(['dist/**', '!dist']);
}

// Export tasks/scripts
exports.styles = styles;
exports.clean = clean;
exports.start = series(devServer);
// exports.watch = watchFiles;
exports.build = series(clean, parallel(static, styles, scripts, images));
exports.serve = devServer;
// ************************ ALL CODE BELOW HERE IS FOR GULP VERSION 3 ****************

// const gulp = require('gulp');
// const postcss = require('gulp-postcss');
// // Compile SCSS to CSS
// const sass = require('gulp-sass');
// // Automatically add any browser prefixes to CSS
// const autoprefixer = require('autoprefixer');
// // Run a local server
// const browserSync = require('browser-sync').create();
// // For minifying CSS
// const cleanCSS = require('gulp-clean-css');
// // Babel for JS
// const babel = require('gulp-babel');
// // Minimize JS
// const uglify = require('gulp-uglify');
// // Minimize images
// const imagemin = require('gulp-imagemin');
// // Only deal with files that have changed since the last run
// const changed = require('gulp-changed');
// const size = require('gulp-size');

// // *** FILE TASKS

// // Port root directory files to dist folder (index.html & favicon package files)
// gulp.task('root', function() {
//   return gulp
//     .src('src/*.{html,ico,png,xml,svg,webmanifest}')
//     .pipe(changed('dist'))
//     .pipe(gulp.dest('dist'))
//     .pipe(browserSync.stream());
// });

// // Build SCSS files to CSS files in dist folder
// gulp.task('styles', function() {
//   return (
//     gulp
//       .src('src/styles/*.scss')
//       .pipe(changed('dist/styles'))
//       // Compile SCSS to CSS
//       .pipe(sass())
//       .pipe(
//         postcss([
//           // Add browser prefixes
//           autoprefixer({}),
//         ])
//       )
//       // minify CSS
//       .pipe(cleanCSS({}))
//       // Send compiled CSS to dist folder
//       .pipe(gulp.dest('dist/styles'))
//       // Hot reloading for browser-sync
//       .pipe(browserSync.stream())
//   );
// });

// // Compiles JS files to dist folder
// gulp.task('js', function() {
//   return (
//     gulp
//       .src('src/js/*.js')
//       .pipe(changed('dist/js'))
//       .pipe(
//         babel({
//           presets: ['@babel/env'],
//         })
//       )
//       .pipe(uglify())
//       .pipe(size({ showFiles: true }))
//       .pipe(gulp.dest('dist/js'))
//       // Hot reloading for browser-sync
//       .pipe(browserSync.stream())
//   );
// });

// // Minify images and send to dist folder
// gulp.task('images', function() {
//   return gulp
//     .src('src/images/*.{png,gif,jpg,jpeg.svg}')
//     .pipe(changed('dist/images'))
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/images'));
// });

// // *** SERVER TASK

// // Boot up browser-sync server and hot reload when files change
// gulp.task('serve', ['root', 'styles', 'js', 'images'], function() {
//   browserSync.init({
//     port: 8080,
//     server: {
//       baseDir: './dist',
//     },
//   });

//   // Watch for file changes
//   gulp.watch('src/*.{html,ico,png,xml,svg,webmanifest}', ['html']);
//   gulp.watch('src/styles/*.scss', ['styles']);
//   gulp.watch('src/js/*.js', ['js']);
//   gulp.watch('src/images/*.{png,gif,jpg,jpeg,svg', ['images']);
// });

// // *** RUN FILE TASKS WITHOUT SERVER

// // Default task to run all file tasks
// gulp.task('default', ['root', 'styles', 'js', 'images']);
