// JS: code split vendors, dev source maps
// CSS: dev source maps?
// Image minification
// Browser sync: add any more options?
// Bundle analyzer
// Cache busting with hashed file names
// When do I need to use done()?

// ************************* Imports *************************

const { src, dest, series, parallel, watch } = require('gulp'),
  // BrowserSync for dev server and hot reloading
  bs = require('browser-sync').create(),
  sass = require('gulp-sass'),
  // fs needed to check if src/css file exists in development
  fs = require('fs'),
  // Minimize HTML
  htmlmin = require('gulp-htmlmin'),
  // Minimize & optimize CSS
  cleanCSS = require('gulp-clean-css'),
  // PostCSS with autoprefixer
  postCSS = require('gulp-postcss'),
  // Babel for Gulp
  babel = require('gulp-babel'),
  // Minimize JS
  uglify = require('gulp-uglify'),
  // Show sizes of files in the terminal
  size = require('gulp-size'),
  // Remove comments from files for production
  strip = require('gulp-strip-comments'),
  // Used to wipe contents of dist when running build task
  del = require('del');

//   imagemin = require('gulp-imagemin');

// ************************* Development Tasks *************************

// Task to run the BrowserSync server
function browserSync() {
  if (!fs.existsSync('./src/css/main.css')) {
    serveSass();
  }

  bs.init({
    port: 8080,
    server: {
      baseDir: 'src',
    },
  });

  watch('src/*.html').on('change', bs.reload);
  watch('src/scss/*.scss', serveSass);
  watch('src/js/*.js').on('change', bs.reload);
}

// Compile Sass to CSS in development
function serveSass() {
  return src('src/scss/*.scss')
    .pipe(sass())
    .pipe(dest('src/css'))
    .pipe(bs.stream());
}

// ************************* Production Tasks *************************

// // Port root directory files to dist folder (index.html & favicon package files)
// gulp.task('root', function() {
//   return gulp
//     .src('src/*.{html,ico,png,xml,svg,webmanifest}')
//     .pipe(changed('dist'))
//     .pipe(gulp.dest('dist'))
//     .pipe(browserSync.stream());
// });

// Wipe contents of dist folder
function clean() {
  return del(['dist/**', '!dist']);
}

// Miniize HTML files
function buildHTML() {
  return src('src/*.html')
    .pipe(strip())
    .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
    .pipe(size({ showFiles: true }))
    .pipe(dest('dist'));
}

// Move favicon files from src to dist
function buildFavicon() {
  // do i need to have changed in here?
  return src('src/*.{ico,png,xml,svg,webmanifest}').pipe(dest('dist'));
}

// Minimize CSS files and add prefixes if needed
function buildCSS() {
  return (
    src('src/scss/*.scss')
      // changed doesn't seem to be working either here or in buildJS
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(cleanCSS())
      .pipe(postCSS())
      .pipe(size({ showFiles: true }))
      .pipe(dest('dist/css'))
  );
}

// Minimize JavaScript files
function buildJS() {
  return src('src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(size({ showFiles: true }))
    .pipe(dest('dist/js'));
}

//   gulp.watch('src/images/*.{png,gif,jpg,jpeg,svg', ['images']);
// });

// // Handle images
// function images() {
//   return src('src/images/*.{png,gif,jpg,jpeg.svg}')
//     .pipe(imagemin())
//     .pipe(dest('dist/images'));
// }

// // Minify images and send to dist folder
// gulp.task('images', function() {
//   return gulp
//     .src('src/images/*.{png,gif,jpg,jpeg.svg}')
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/images'));
// });

// ************************* Exported Tasks *************************

exports.serve = browserSync;
exports.clean = clean;
exports.build = series(
  clean,
  parallel(buildHTML, buildFavicon, buildCSS, buildJS)
);
