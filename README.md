# Dan Buda's Gulp Framework

<kbd>![Image](gulpframework.png)</kbd>

A simple Gulp framework with a development server and production script for front-end projects using HTML, CSS and Vanilla JavaScript.

## Features

- Browser "reset" using `normalize.css`
- Production build with minified HTML, CSS, JavaScript (using Babel 8) and images
- Automatically add browser prefixes with `postcss` and `autoprefixer` (default set to last 2 versions)
- Local development server with hot reloading using `browser-sync`

## How to Use

- Git clone or fork the repository
- `npm install` or `npm i` to install dependencies
- `gulp serve` to launch development server with hot reloading at `localhost:8080`
- `gulp build` to run the production task
- Do all of your work in the `src` directory and build production files to the `dist` directory

## Version Information

### 4.0.0

- Changed all packages used in `gulpfile.js` from `require()` to ESM `import` syntax
- Cleaned up `gulpfile.js` comments and reordered code
- Removed separate `postcss.config.js` file and add that information to `gulpfile.js`
- Removed Sass in favor of pure CSS
- Updated all npm packages to latest versions
- Removed Google Analytics template language in `index.html`
-

### 3.0.0

- Updated all dependencies to most current versions as of June 5, 2023
- Replaced deprecated packages and babel-eslint

### 2.1.0

- Added configurations for ESLint, Stylelint, Prettier
- Several semver breaking updates to dependencies
- Minor tweaks to `gulpfile.js` due to linting

### 2.0.0

- `gulp` v4.0.1
- `normalize.css` v8.0.1
- `browser-sync` v2.26.5 for development server with hot reloading
- HTML minification with `gulp-htmlmin` v5.0.1
- CSS minification and prefixing with `autoprefixer` v9.5.1 & `gulp-postcss` v8.0.0
- Removal of dead/unused CSS with `gulp-purifycss` v0.2.0
- JavaScript minification with Babel 7 (`@babel/core` v7.4.3, `gulp-babel` v7.4.3) & `gulp-uglify` v3.0.2
- Image minification with `gulp-imagemin` v5.0.3
- Remove comments in production files with `gulp-strip-comments` v2.5.2

### 1.0.0

Link to the last version using Gulp v3 can be found [here](https://github.com/DanBuda11/gulp-framework/tree/2165768315c837f24a332c1d098abc750a360414).

- `gulp` v3.9.1
- `normalize.css` v8.0.0
- Compile `.scss` to CSS with `gulp-sass` v4.0.1, add browser prefixes with `gulp-postcss` v7.0.5 and `autoprefixer` v9.1.5 plugin, and minify with `gulp-clean-css` v3.10.0
- Compile JavaScript with Babel 7 (`gulp-babel` v8.0.0, `@babel/core` v7.1.2, `@babel/preset-env` v7.1.0) and minifiy with `gulp-uglify` v3.0.1
- Minified images with `gulp-imagemin` v4.1.0
- `browser-sync` v2.26.0 for local server and hot reloading of changed files; bypass unchanged files with `gulp-changed` v3.2.0
