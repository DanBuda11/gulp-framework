// ************************* Imports *************************

const { src, dest, series, parallel, watch } = require('gulp');
// BrowserSync for dev server and hot reloading
const bs = require('browser-sync').create();
const sass = require('gulp-sass');
// Minimize HTML
const htmlmin = require('gulp-htmlmin');
// Minimize & optimize CSS
const cleanCSS = require('gulp-clean-css');
// Remove unused/dead CSS
const purifyCSS = require('gulp-purifycss');
// PostCSS with autoprefixer
const postCSS = require('gulp-postcss');
// Babel for Gulp
const babel = require('gulp-babel');
// Minimize JS
const uglify = require('gulp-uglify');
// Minify images
const imagemin = require('gulp-imagemin');
// Show sizes of files in the terminal
const size = require('gulp-size');
// Remove comments from files for production
const strip = require('gulp-strip-comments');
// Used to wipe contents of dist when running build task
const del = require('del');

// ************************* Folder Paths *************************

const paths = {
  input: 'src',
  output: 'dist',
  devHTML: 'src/*.html',
  devCSS: 'src/css',
  devSCSS: 'src/scss/*.scss',
  devJS: 'src/js/*.js',
  devImages: 'src/images/*.{png,gif,jpg,jpeg,svg}',
  devFavicons: 'src/*.{ico,png,xml,svg,webmanifest}',
  prodCSS: 'dist/css',
  prodJS: 'dist/js',
  prodImages: 'dist/images',
  normalize: 'src/css/normalize.css',
};

// ************************* Development Tasks *************************

// Compile Sass to CSS in development
function serveSass() {
  return src(paths.devSCSS)
    .pipe(sass())
    .pipe(dest(paths.devCSS))
    .pipe(bs.stream());
}

// Task to run the BrowserSync server
function browserSync() {
  // Run serveSass when starting the dev server to make sure the SCSS & dev CSS are the same
  serveSass();

  bs.init({
    // Dev server will run at localhost:8080
    port: 8080,
    server: {
      baseDir: paths.input,
    },
  });

  watch(paths.devHTML).on('change', bs.reload);
  watch(paths.devSCSS, serveSass);
  watch(paths.devJS).on('change', bs.reload);
}

// ************************* Production Tasks *************************

// Wipe contents of dist folder
function clean() {
  return del([`${paths.output}/**`, `!${paths.output}`]);
}

// Minimize HTML files
function buildHTML() {
  return src(paths.devHTML)
    .pipe(strip())
    .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.output));
}

// Move favicon files from src to dist if they exist
function buildFavicon() {
  return src(paths.devFavicons).pipe(dest(paths.output));
}

// Minimize CSS files and add prefixes if needed
function buildCSS() {
  return src(paths.devSCSS)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(purifyCSS([paths.devHTML, paths.devJS]))
    .pipe(cleanCSS())
    .pipe(postCSS())
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodCSS));
}

// Move normalize.css from src/css to dist/css
function buildNormalize() {
  return src(paths.normalize)
    .pipe(cleanCSS())
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodCSS));
}

// Minimize JavaScript files
function buildJS() {
  return src(paths.devJS)
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodJS));
}

// Minimize images
function buildImages() {
  return src(paths.devImages)
    .pipe(imagemin())
    .pipe(size({ showFiles: true }))
    .pipe(dest(paths.prodImages));
}

// ************************* Exported Tasks *************************

// Run gulp serve in the terminal to start development mode
exports.serve = browserSync;
// Run gulp clean to empty dist folder
exports.clean = clean;
// Run gulp build to run production build
exports.build = series(
  clean,
  parallel(
    buildHTML,
    buildFavicon,
    buildCSS,
    buildNormalize,
    buildJS,
    buildImages,
  ),
);
