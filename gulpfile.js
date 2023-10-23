// ************************* Imports *************************

import gulp from 'gulp';
// BrowserSync for dev server and hot reloading
import browserSync from 'browser-sync';

// Used to wipe contents of dist when running build task
import { deleteAsync } from 'del';

// Minimize HTML
import htmlmin from 'gulp-htmlmin';
// const htmlmin = require('gulp-htmlmin');
// // Minimize & optimize CSS
// const cleanCSS = require('gulp-clean-css');
import cleanCSS from 'gulp-clean-css';
// // Remove unused/dead CSS
// const purifyCSS = require('gulp-purifycss');
import purifyCSS from 'gulp-purifycss';
// // PostCSS with autoprefixer
import postCSS from 'gulp-postcss';
// const postCSS = require('gulp-postcss');
// // Babel for Gulp
// const babel = require('gulp-babel');
// // Minimize JS
// const uglify = require('gulp-uglify');
// // Minify images
// const imagemin = require('gulp-imagemin');
// // Show sizes of files in the terminal
// const size = require('gulp-size');
import size from 'gulp-size';
// // Remove comments from files for production
// const strip = require('gulp-strip-comments');
import strip from 'gulp-strip-comments';

const { src, dest, series, parallel, watch } = gulp;
const bs = browserSync;

// ************************* Folder Paths *************************

const paths = {
  input: 'src',
  output: 'dist',
  devHTML: 'src/*.html',
  devCSS: 'src/css/*.css',
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
export function serve() {
  // Run serveSass when starting the dev server to make sure the SCSS & dev CSS are the same
  // serveSass();

  bs.init({
    // Dev server will run at localhost:8080
    port: 8080,
    server: {
      baseDir: paths.input,
    },
  });

  watch(paths.devHTML).on('change', bs.reload);
  watch(paths.devCSS).on('change', bs.reload);
  watch(paths.devJS).on('change', bs.reload);
}

// ************************* Production Tasks *************************

// Wipe contents of dist folder
export function clean() {
  return deleteAsync([`${paths.output}/**`, `!${paths.output}`]);
}

// Minimize HTML files
export function buildHTML() {
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
export function buildCSS() {
  return (
    src(paths.devCSS)
      // .pipe(sass())
      // .on('error', sass.logError)
      .pipe(purifyCSS([paths.devHTML, paths.devJS]))
      .pipe(cleanCSS())
      .pipe(postCSS())
      .pipe(size({ showFiles: true }))
      .pipe(dest(paths.prodCSS))
  );
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
      })
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
// export { bSync as serve };

// export clean;

export const build = series(clean, parallel(buildHTML, buildCSS));

// // exports.serve = browserSync;
// // Run gulp clean to empty dist folder
// exports.clean = clean;
// // Run gulp build to run production build
// exports.build = series(
//   clean,
//   parallel(
//     buildHTML,
//     buildFavicon,
//     buildCSS,
//     buildNormalize,
//     buildJS,
//     buildImages
//   )
// );
