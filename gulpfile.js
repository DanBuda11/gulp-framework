// Need tasks a dev server that hot reloads when scss, js, html change
//   Don't need to minify, compile, anything
// Need tasks for production build into dist folder
//   This is when I turn up the juice and compile, minify, uglify, etc
// When do I need to use done()?

// JS: code split vendors, dev source maps
// CSS: dev source maps?, cssnano?, is autoprefixer working?, remove comments
// HTML: copy template and inject links/js/etc, remove comments
// Image minification
// Browser sync: add any more options?
// Bundle analyzer
// Cache busting with hashed file names
// gulp-strip-comments doesn't seem to be needed for JS & CSS build tasks; haven't tested HTML

// ********** Current Attempt *****************************

// Imports
const { src, dest, series, parallel, watch } = require('gulp'),
  sass = require('gulp-sass'),
  // BrowserSync for dev server and hot reloading
  bs = require('browser-sync').create(),
  // Only run tasks on files changed since last time task ran
  changed = require('gulp-changed'),
  // Babel for Gulp
  babel = require('gulp-babel'),
  // Minimize JS
  uglify = require('gulp-uglify'),
  // Show sizes of files in the terminal
  size = require('gulp-size'),
  // Remove comments from files for production
  strip = require('gulp-strip-comments'),
  del = require('del'),
  cleanCSS = require('gulp-clean-css'),
  postCSS = require('gulp-postcss');

// Development Tasks
function browserSync() {
  bs.init({
    port: 8080,
    server: {
      baseDir: 'src',
    },
  });

  watch('src/*.html', serveHTML);
  watch('src/scss/*.scss', serveSass);
  watch('src/js/*.js', serveJS);
}

// Do I even need this or serveJS?
function serveHTML() {
  return src('src/*.html').pipe(bs.stream);
}

function serveSass() {
  return src('src/scss/*.scss')
    .pipe(sass())
    .pipe(dest('src/css'))
    .pipe(bs.stream());
}

function serveJS() {
  return src('src/js/*.js').pipe(bs.stream());
}

// Production Tasks
function clean() {
  return del(['dist/**', '!dist']);
}

function buildHTML() {}

function buildCSS() {
  return (
    src('src/scss/*.scss')
      // changed doesn't seem to be working either here or in buildJS
      .pipe(changed('dist/css', { extension: '.css' }))
      .pipe(sass())
      .on('error', sass.logError)
      // .pipe(strip())
      // Should cleanCSS or postCSS come first?
      .pipe(cleanCSS())
      .pipe(postCSS())
      .pipe(size({ showFiles: true }))
      .pipe(dest('dist/css'))
  );
}

function buildJS() {
  return (
    src('src/js/*.js')
      .pipe(changed('dist/js'))
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(uglify())
      // .pipe(strip())
      .pipe(size({ showFiles: true }))
      .pipe(dest('dist/js'))
      .pipe(bs.stream())
  );
}

// Exports
exports.serve = browserSync;
exports.clean = clean;
exports.build = series(clean, parallel(buildCSS, buildJS));

//   imagemin = require('gulp-imagemin');

// // Handle HTML files
// // Handle favicon set
// function static() {
//   return src('src/index.html')
//     .pipe(dest('dist'))
//     .pipe(browsersync.stream());
// }

// // Handle images
// function images() {
//   return src('src/images/*.{png,gif,jpg,jpeg.svg}')
//     .pipe(imagemin())
//     .pipe(dest('dist/images'));
// }

//   // watch('./src/index.html', series(static));
//   watch('styles/*.scss', scss);
//   // watch('./src/js/*.js', scripts);
//   // watch('./src/images/*', images);
//   // done();
// }

// // function watchFiles() {
// //   watch('./src/index.html', static);
// //   watch('./src/styles/*.scss', styles);
// //   watch('./src/js/*.js', scripts);
// //   watch('./src/images/*', images);
// //   // watch('./src/*', static);
// // }

// // Minimize images
// const imagemin = require('gulp-imagemin');

// // *** FILE TASKS

// // Port root directory files to dist folder (index.html & favicon package files)
// gulp.task('root', function() {
//   return gulp
//     .src('src/*.{html,ico,png,xml,svg,webmanifest}')
//     .pipe(changed('dist'))
//     .pipe(gulp.dest('dist'))
//     .pipe(browserSync.stream());
// });

// // Minify images and send to dist folder
// gulp.task('images', function() {
//   return gulp
//     .src('src/images/*.{png,gif,jpg,jpeg.svg}')
//     .pipe(changed('dist/images'))
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/images'));
// });

//   // Watch for file changes
//   gulp.watch('src/*.{html,ico,png,xml,svg,webmanifest}', ['html']);
//   gulp.watch('src/images/*.{png,gif,jpg,jpeg,svg', ['images']);
// });

// // *** RUN FILE TASKS WITHOUT SERVER

// // Default task to run all file tasks
// gulp.task('default', ['root', 'styles', 'js', 'images']);
