// ************************* Imports *************************

import gulp from 'gulp';
// BrowserSync for dev server and hot reloading
import browserSync from 'browser-sync';
// Used to wipe contents of dist when running build task
import { deleteAsync } from 'del';
// Minimize HTML
import htmlmin from 'gulp-htmlmin';
// Minimize & optimize CSS
import cleanCSS from 'gulp-clean-css';
// Remove unused/dead CSS
import purifyCSS from 'gulp-purifycss';
// PostCSS (using autoprefixer plugin)
import postCSS from 'gulp-postcss';
// Autoprefixer as a postCSS plugin
import autoprefixer from 'autoprefixer';
// Babel for Gulp
import babel from 'gulp-babel';
// Minimize JS
import uglify from 'gulp-uglify';
// Minify images
import imagemin from 'gulp-imagemin';
// Show sizes of files in the terminal
import size from 'gulp-size';
// Remove comments from files for production
import strip from 'gulp-strip-comments';

// Import named methods from gulp
const { src, dest, series, parallel, watch } = gulp;
// Rename browserSync to shorten (personal preference)
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

// ************************* Production Tasks *************************

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
export function buildCSS() {
  return src(paths.devCSS)
    .pipe(purifyCSS([paths.devHTML, paths.devJS]))
    .pipe(cleanCSS())
    .pipe(postCSS([autoprefixer()]))
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

// ************************* Exported Tasks to Run on Command Line *************************

// BrowserSync dev server
export function serve() {
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

// Wipe contents of dist folder
export function clean() {
  return deleteAsync([`${paths.output}/**`, `!${paths.output}`]);
}

// Run production build
export const build = series(
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
